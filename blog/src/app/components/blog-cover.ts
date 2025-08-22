import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DateTime } from 'luxon';

import { ContentFile } from '@analogjs/content';
import { TranslocoDirective } from '@jsverse/transloco';

import { PostAttributes } from '../models/post.model';

@Component({
  standalone: true,
  selector: 'app-blog-cover',
  imports: [NgOptimizedImage, RouterLink, DatePipe, TranslocoDirective],
  host: {
    class: 'p-0',
  },
  template: `
    <ng-container *transloco="let t; read: 'blog'">
      @if (isNew(post.attributes.date)) {
        <div
          class="bg-primary absolute z-50 flex h-10 w-20 animate-bounce items-center justify-center rounded-lg font-bold">
          {{ t('new') }}
        </div>
      }
      <div
        class="card bg-base-100 font-terminal relative h-[490px] shadow-xl lg:w-96">
        <figure class="flex-none">
          <img
            class="w-full"
            [ngSrc]="post.attributes.coverImage"
            width="500"
            height="210"
            alt="{{ t('alt') }}" />
        </figure>
        <div class="card-body p-4">
          <h2 class="card-title font-terminal text-base-content basis-2/6">
            {{ post.attributes.title }}
          </h2>
          <p class="font-terminal text-base-content">
            {{ post.attributes.description }}
          </p>
          <div class="card-actions jus items-center justify-between">
            <div class="badge badge-outline font-terminal">
              {{ post.attributes.date | date }}
            </div>
            <button
              [routerLink]="post.attributes.slug"
              class="btn btn-secondary font-terminal">
              {{ t('read') }}
            </button>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class BlogCoverComponent {
  @Input({ required: true }) post!: ContentFile<PostAttributes>;

  //method that returns true if the date is >= today - 7 days using luxon
  isNew(date: string): boolean {
    const today = DateTime.now();
    const sevenDaysAgo = today.minus({ days: 7 });
    const postDate = DateTime.fromISO(date);
    return postDate >= sevenDaysAgo;
  }
}
