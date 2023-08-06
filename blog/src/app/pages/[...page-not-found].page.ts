import { RouteMeta } from '@analogjs/router';
import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Page Not Found',
};

@Component({
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <div class="relative flex flex-auto items-center justify-center">
      <div class="flex flex-col items-center justify-items-center">
        <img
          ngSrc="assets/not-found.svg"
          alt="Not Found Image"
          width="566"
          height="400" />
        <button routerLink="/" class="btn btn-primary">Take me Home!!</button>
      </div>
    </div>
  `,
})
export default class NotFoundPage {}
