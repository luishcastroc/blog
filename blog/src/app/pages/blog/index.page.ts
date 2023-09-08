import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { BlogListComponent } from '../../components/blog-list.component';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Blog',
  meta: [{ name: 'description', content: 'Blog Posts' }],
};

@Component({
  standalone: true,
  imports: [BlogListComponent],
  template: ` <mr-blog-list /> `,
})
export default class BlogIndexPage {}
