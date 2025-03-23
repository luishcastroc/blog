import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { BlogListComponent } from '../../components/blog-list';

/**
 * Route metadata for the blog index page
 * Kept outside the component to separate routing concerns
 */
export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Blog',
  meta: [{ name: 'description', content: 'Blog Posts' }],
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
