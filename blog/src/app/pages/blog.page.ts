import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouteMeta } from '@analogjs/router';
import { RouterLink, RouterOutlet } from '@angular/router';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Blog',
  meta: [{ name: 'description', content: 'Blog Posts' }],
};

@Component({
  selector: 'mr-blog-page',
  standalone: true,
  imports: [RouterLink, NgFor, RouterOutlet],
  template: `
    <div class="flex flex-auto flex-col overflow-auto lg:flex-row ">
      <router-outlet></router-outlet>
    </div>
  `,
})
export default class BlogPage {}
