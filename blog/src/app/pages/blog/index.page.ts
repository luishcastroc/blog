import { BlogCoverComponent } from '../../components/blog-cover.component';
import { Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { JsonPipe, NgFor } from '@angular/common';
import { PostAttributes } from '../../models/post.model';
import { RouteMeta } from '@analogjs/router';
import { RouterLink } from '@angular/router';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Blog',
  meta: [{ name: 'description', content: 'Blog Posts' }],
};

@Component({
  standalone: true,
  imports: [RouterLink, NgFor, JsonPipe, BlogCoverComponent],
  template: `
    <div class="flex gap-8 lg:gap-6 flex-col lg:flex-row overflow-auto ">
      <ng-container *ngFor="let post of posts">
        <blog-cover [post]="post" />
      </ng-container>
    </div>
  `,
})
export default class BlogIndexPage {
  readonly posts = injectContentFiles<PostAttributes>().sort((a, b) => {
    return (
      new Date(b.attributes.date).getTime() -
      new Date(a.attributes.date).getTime()
    );
  });
}
