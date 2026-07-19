import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { DateTime } from 'luxon';
import { map } from 'rxjs';

import {
  ContentFile,
  injectContent,
  injectContentFiles,
} from '@analogjs/content';

import { PostAttributes } from '../../models/post.model';

export type BlogPost = ContentFile<PostAttributes> & {
  nextPost?: string;
  previousPost?: string;
};

/**
 * Loads the post for the current :slug in the given locale, decorated with
 * next/previous slugs from the locale's date-sorted post list.
 *
 * When the slug doesn't exist in the locale (e.g. the language was switched
 * on a slug that only exists in the other language), redirects to the
 * translated slug from the source post's `otherSlug`; the base href supplies
 * the active locale prefix. Must be called in an injection context.
 */
export function injectPostWithNavigation(
  locale: string
): Signal<BlogPost | null> {
  const contentFiles = injectContentFiles<PostAttributes>();
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  let redirected = false;

  // Newest first, so index - 1 is the next (more recent) post.
  const sortedPosts = contentFiles
    .filter(file => file.filename.split('/')[3] === locale)
    .sort((a, b) => postDate(b).toMillis() - postDate(a).toMillis());

  const redirectToLocalizedSlug = () => {
    if (redirected) return;
    const slug = route.snapshot.params['slug'];
    if (!slug) return;

    const source = contentFiles.find(
      file => file.attributes.slug === slug || file.slug === slug
    );
    const otherSlug = source?.attributes.otherSlug;
    if (otherSlug && otherSlug !== slug) {
      redirected = true;
      router.navigate(['/blog', otherSlug]);
    }
  };

  return toSignal(
    injectContent<PostAttributes>({
      param: 'slug',
      subdirectory: locale,
    }).pipe(
      map(post => {
        // injectContent yields an empty object (no attributes) when the file
        // for this locale+slug doesn't exist — treat that as "not found".
        if (!isBlogPost(post)) {
          redirectToLocalizedSlug();
          return null;
        }
        redirected = false;

        const index = sortedPosts.findIndex(
          other => other.attributes.slug === post.attributes.slug
        );
        return {
          ...post,
          nextPost: sortedPosts[index - 1]?.slug,
          previousPost: sortedPosts[index + 1]?.slug,
        };
      })
    ),
    { initialValue: null }
  );
}

function postDate(post: ContentFile<PostAttributes>): DateTime {
  return DateTime.fromFormat(post.attributes.date, 'MM-dd-yyyy');
}

function isBlogPost(
  content: ContentFile<PostAttributes | Record<string, never>>
): content is ContentFile<PostAttributes> {
  return typeof content.attributes['title'] === 'string';
}
