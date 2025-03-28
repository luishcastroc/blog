import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-page-not-found',
  imports: [RouterLink, NgOptimizedImage, TranslocoModule],
  template: `
    <ng-container *transloco="let t">
      <div class="relative flex flex-auto items-center justify-center">
        <div class="flex flex-col items-center justify-items-center">
          <img
            ngSrc="v1694226664/not-found.svg"
            alt="Not Found Image"
            width="566"
            height="400" />
          <button routerLink="/" class="btn btn-primary">
            {{ t('take-me-home') }}
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
export default class PageNotFoundComponent {
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle('Luis Castro - Page Not Found');
  }
}
