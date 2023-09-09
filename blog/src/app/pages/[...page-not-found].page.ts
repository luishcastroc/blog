import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouteMeta } from '@analogjs/router';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Page Not Found',
};

@Component({
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, TranslocoModule],
  template: `<ng-container *transloco="let t">
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
  </ng-container> `,
})
export default class NotFoundPage {}
