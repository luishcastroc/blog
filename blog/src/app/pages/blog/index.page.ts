import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { BlogListComponent } from '../../components/blog-list';

/**
 * Route metadata for the blog index page.
 * Title/description use resolver functions so they run at navigation time —
 * after the active locale's translations are loaded — and localize correctly.
 */
export const routeMeta: RouteMeta = {
  title: () => $localize`:@@title.blog:Luis Castro - Blog`,
  meta: [
    {
      name: 'description',
      content: $localize`:@@meta.blog-description:Blog Posts`,
    },
  ],
};

/**
 * Container component for the blog index page
 * Following SRP by delegating blog listing functionality to a dedicated component
 */
@Component({
  selector: 'app-blog-index-page',
  standalone: true,
  imports: [BlogListComponent],
  template: `<app-blog-list />`,
})
export default class BlogIndexPageComponent {}
