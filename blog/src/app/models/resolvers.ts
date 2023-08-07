import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { MetaTag } from '@analogjs/router';
import { PostAttributes } from './post.model';

function injectActivePostAttributes(
  route: ActivatedRouteSnapshot
): PostAttributes {
  const file = injectContentFiles<PostAttributes>().find(contentFile => {
    return (
      contentFile.filename === `/src/content/${route.params['slug']}.md` ||
      contentFile.slug === route.params['slug']
    );
  });

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
      content: postAttributes.coverImage,
    },
  ];
};
