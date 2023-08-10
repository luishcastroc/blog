import {
  ContentFile,
  injectContent,
  injectContentFiles,
  MarkdownComponent,
} from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { postMetaResolver, postTitleResolver } from '../../models/resolvers';
import { PostAttributes } from '../../models/post.model';
import { RouterLinkWithHref } from '@angular/router';
import { combineLatest, map, of, tap } from 'rxjs';
import { DateTime } from 'luxon';

export const routeMeta: RouteMeta = {
  title: postTitleResolver,
  meta: postMetaResolver,
};

@Component({
  standalone: true,
  imports: [MarkdownComponent, AsyncPipe, NgIf, RouterLinkWithHref],
  host: { class: 'px-0' },
  template: `
    <article
      class="text-primary-content flex w-full flex-auto flex-col items-center gap-4 overflow-auto"
      *ngIf="post$ | async as post">
      <section
        class="mb-4 flex w-full flex-auto flex-row justify-between gap-4 lg:w-3/5">
        <button
          [routerLink]="['/blog', post.previousPost]"
          [disabled]="!post.previousPost"
          class="btn btn-accent w-28"
          type="button"
          aria-label="Previous Blog Post">
          Previous</button
        ><button
          [routerLink]="['/blog', post.nextPost]"
          [disabled]="!post.nextPost"
          class="btn btn-accent w-28"
          type="button"
          aria-label="Next Blog Post">
          Next
        </button>
      </section>
      <h1 class="self-center text-center text-3xl font-extrabold lg:w-3/5">
        {{ post.attributes.title }}
      </h1>
      <div
        class="line-numbers blog-post container w-full pb-8 pt-4 md:w-11/12 md:px-0 lg:w-3/5">
        <analog-markdown [content]="post.content"></analog-markdown>
      </div>
    </article>
  `,
})
export default class BlogPostComponent {
  readonly post$ = combineLatest([
    of(injectContentFiles<PostAttributes>()),
    injectContent<PostAttributes>(),
  ]).pipe(
    map(([files, post]) => {
      const sortedFiles = files
        .map(file => {
          const date = DateTime.fromFormat(file.attributes.date, 'MM-dd-yyyy');
          const dateString = date.toISODate();
          return {
            ...file,
            attributes: {
              ...file.attributes,
              date: dateString as string,
            },
          };
        })
        .sort((a, b) => {
          return (
            DateTime.fromISO(b.attributes.date).toMillis() -
            DateTime.fromISO(a.attributes.date).toMillis()
          );
        });
      return { sortedFiles, post };
    }),
    map(({ sortedFiles, post }) => {
      const index = sortedFiles.findIndex(
        file => file.attributes.slug === post.attributes.slug
      );
      const nextPost = sortedFiles[index - 1]?.slug;
      const previousPost = sortedFiles[index + 1]?.slug;
      return {
        ...post,
        nextPost,
        previousPost,
      };
    })
  );
}
