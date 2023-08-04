import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { postMetaResolver, postTitleResolver } from '../../models/resolvers';
import { PostAttributes } from '../../models/post.model';

export const routeMeta: RouteMeta = {
  title: postTitleResolver,
  meta: postMetaResolver,
};

@Component({
  standalone: true,
  imports: [MarkdownComponent, AsyncPipe, NgIf],
  host: { class: 'px-0' },
  template: `
    <article
      class="text-primary-content flex w-full flex-auto flex-col items-center gap-4 overflow-auto"
      *ngIf="post$ | async as post">
      <h1
        class="self-center text-center text-3xl font-extrabold md:w-1/2 lg:w-3/5">
        {{ post.attributes.title }}
      </h1>
      <div
        class="line-numbers blog-post container w-full px-8 pb-8 pt-4 md:w-11/12 md:px-0 lg:w-3/5">
        <analog-markdown [content]="post.content"></analog-markdown>
      </div>
    </article>
  `,
})
export default class BlogPostComponent {
  readonly post$ = injectContent<PostAttributes>();
}
