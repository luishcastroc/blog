import { BlogListComponent } from '../../components/blog-list.component';
import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Blog',
  meta: [{ name: 'description', content: 'Blog Posts' }],
};

@Component({
  selector: 'mr-blog-index-page',
  standalone: true,
  imports: [BlogListComponent],
  template: ` <mr-blog-list /> `,
})
export default class BlogIndexPage {}
