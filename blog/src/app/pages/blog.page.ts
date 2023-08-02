import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { JsonPipe, NgFor } from '@angular/common';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Blog',
  meta: [{ name: 'description', content: 'Blog Posts' }],
};

@Component({
  standalone: true,
  imports: [RouterLink, NgFor, JsonPipe, RouterOutlet],
  template: `
    <div class="flex flex-col lg:flex-row overflow-auto ">
      <router-outlet></router-outlet>
    </div>
  `,
})
export default class BlogPage {}
