import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { JsonPipe, NgFor } from '@angular/common';
import { RouteMeta } from '@analogjs/router';
import { PostAttributes } from '../models/post.model';
import { BlogCoverComponent } from '../components/blog-cover.component';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Blog',
  meta: [{ name: 'description', content: 'Blog Posts' }],
};

@Component({
  standalone: true,
  imports: [RouterLink, NgFor, JsonPipe, BlogCoverComponent],
  template: `
    <div class="grid gap-4 lg:grid-cols-5">
      <ng-container *ngFor="let post of posts">
        <blog-cover [post]="post" />
      </ng-container>
    </div>
  `,
})
export default class BlogPage {
  readonly posts = injectContentFiles<PostAttributes>();
}
