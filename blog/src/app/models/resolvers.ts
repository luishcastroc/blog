import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { MetaTag } from '@analogjs/router';
import { PostAttributes } from './post.model';
import { TranslocoService } from '@jsverse/transloco';

// Constants
const DOMAIN = 'mrrobot.dev';
const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/lhcc0134/';

function removeDateFromFile(filename: string): string {
  return filename.replace(/(\d{4}-\d{2}-\d{2}-)/, '');
}

function injectActivePostAttributes(
  route: ActivatedRouteSnapshot
): PostAttributes {
  const router = inject(Router);
  const activeLang = inject(TranslocoService).getActiveLang();
  const file = injectContentFiles<PostAttributes>().find(contentFile => {
    return (
      removeDateFromFile(contentFile.filename) ===
        `/src/content/${activeLang}/${route.params['slug']}.md` ||
      contentFile.slug === route.params['slug']
    );
  });

  if (!file) {
    router.navigate(['/404']);
  }

  return file!.attributes;
}

export const postTitleResolver: ResolveFn<string> = route =>
  injectActivePostAttributes(route).title;

export const postMetaResolver: ResolveFn<MetaTag[]> = route => {
  const postAttributes = injectActivePostAttributes(route);
  const slug = route.params['slug'];
  const fullUrl = `https://${DOMAIN}/blog/${slug}`;
  const imageUrl = `${CLOUDINARY_BASE_URL}${postAttributes.coverImage}`;

  // Helper functions to create meta tags
  const createMetaTag = (name: string, content: string): MetaTag => ({
    name,
    content,
  });
  const createOgTag = (property: string, content: string): MetaTag => ({
    property: `og:${property}`,
    content,
  });
  const createTwitterTag = (property: string, content: string): MetaTag => ({
    property: `twitter:${property}`,
    content,
  });

  return [
    // Standard meta tags
    createMetaTag('description', postAttributes.description),
    createMetaTag('author', postAttributes.author),

    // Open Graph tags
    createOgTag('title', postAttributes.title),
    createOgTag('description', postAttributes.description),
    createOgTag('image', imageUrl),

    // Twitter tags
    createTwitterTag('card', 'summary_large_image'),
    createTwitterTag('title', postAttributes.title),
    createTwitterTag('description', postAttributes.description),
    createTwitterTag('image', imageUrl),
    createTwitterTag('domain', DOMAIN),
    createTwitterTag('url', fullUrl),
  ];
};
