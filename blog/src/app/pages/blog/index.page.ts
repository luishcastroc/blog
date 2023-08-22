import { BlogCoverComponent } from '../../components/blog-cover.component';
import { Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { JsonPipe, NgFor } from '@angular/common';
import { PostAttributes } from '../../models/post.model';
import { RouteMeta } from '@analogjs/router';
import { RouterLink } from '@angular/router';
import { DateTime } from 'luxon';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Blog',
  meta: [{ name: 'description', content: 'Blog Posts' }],
};

@Component({
  standalone: true,
  imports: [RouterLink, NgFor, JsonPipe, BlogCoverComponent],
  template: `
    <div
      class="flex flex-col flex-wrap justify-center gap-8 overflow-auto pb-4 pt-4 lg:flex-row lg:gap-6 ">
      <ng-container *ngFor="let post of posts">
        <blog-cover [post]="post" />
      </ng-container>
    </div>
  `,
})
export default class BlogIndexPage {
  readonly posts = injectContentFiles<PostAttributes>()
    .map(post => {
      const date = DateTime.fromFormat(post.attributes.date, 'MM-dd-yyyy');
      const dateString = date.toISODate();
      return {
        ...post,
        attributes: {
          ...post.attributes,
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
}
