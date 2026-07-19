import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-page-not-found',
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <div class="flex flex-auto items-center justify-center">
      <div
        class="nb-panel flex max-w-lg flex-col items-center gap-6 text-center">
        <p class="nb-badge text-base">404</p>
        <img
          ngSrc="v1694226664/not-found.svg"
          alt="Not Found"
          width="566"
          height="400"
          class="w-full max-w-xs" />
        <a routerLink="/" class="nb-btn nb-btn--primary" i18n="@@take-me-home">
          Take me home!!
        </a>
      </div>
    </div>
  `,
})
export default class PageNotFoundComponent {
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle(
      $localize`:@@title.not-found:Luis Castro - Page Not Found`
    );
  }
}
