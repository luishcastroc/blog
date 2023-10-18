import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { MetaTag } from '@analogjs/router';
import { PostAttributes } from './post.model';
import { TranslocoService } from '@ngneat/transloco';

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
  return [
    {
      name: 'description',
      content: postAttributes.description,
    },
    {
      name: 'author',
      content: postAttributes.author,
    },
    {
      property: 'og:title',
      content: postAttributes.title,
    },
    {
      property: 'og:description',
      content: postAttributes.description,
    },
    {
      property: 'og:image',
      content: `https://res.cloudinary.com/lhcc0134/${postAttributes.coverImage}`,
    },
  ];
};
