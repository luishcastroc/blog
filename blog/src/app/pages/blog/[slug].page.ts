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
      class="flex flex-col flex-auto gap-4 w-full items-center overflow-auto text-primary-content"
      *ngIf="post$ | async as post">
      <h1
        class="text-3xl font-extrabold self-center md:w-1/2 lg:w-3/5 text-center">
        {{ post.attributes.title }}
      </h1>
      <div
        class="container mx-auto pt-4 px-8 md:px-0 pb-8 w-full md:w-1/2 lg:w-3/5 line-numbers blog-post">
        <analog-markdown [content]="post.content"></analog-markdown>
      </div>
    </article>
  `,
})
export default class BlogPostComponent {
  readonly post$ = injectContent<PostAttributes>();
}
