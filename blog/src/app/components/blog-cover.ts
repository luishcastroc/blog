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
          class="bg-primary text-primary-content terminal-glow absolute z-50 flex h-10 w-20 animate-bounce items-center justify-center rounded-lg font-bold">
          {{ t('new') }}
        </div>
      }
      <div
        class="card bg-base-100 font-terminal border-secondary/30 hover:border-secondary/60 terminal-card relative h-[490px] border-2 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:transform hover:shadow-2xl lg:w-96">
        <figure class="relative flex-none overflow-hidden">
          <img
            class="w-full filter transition-all duration-300 hover:scale-105 hover:brightness-110"
            [ngSrc]="post.attributes.coverImage"
            width="500"
            height="210"
            alt="{{ t('alt') }}" />
          <!-- Terminal scan line effect on image -->
          <div
            class="via-secondary/5 scan-line absolute inset-0 bg-gradient-to-b from-transparent to-transparent"></div>
        </figure>
        <div class="card-body relative p-4">
          <!-- Terminal prompt indicator -->
          <div
            class="text-secondary absolute right-2 top-2 font-mono text-xs opacity-60">
            >
          </div>

          <h2
            class="card-title font-terminal text-base-content hover:text-secondary basis-2/6 transition-colors duration-300">
            {{ post.attributes.title }}
          </h2>
          <p class="font-terminal text-base-content/80 text-sm leading-relaxed">
            {{ post.attributes.description }}
          </p>
          <div class="card-actions mt-auto items-center justify-between">
            <div
              class="badge badge-outline border-secondary/50 text-secondary/70 font-terminal hover:border-secondary hover:text-secondary text-xs transition-all duration-300">
              <span class="text-secondary mr-1">$</span
              >{{ post.attributes.date | date }}
            </div>
            <button
              [routerLink]="post.attributes.slug"
              class="btn btn-secondary font-terminal hover:bg-secondary hover:text-secondary-content border-secondary hover:glow-red border-2 px-4 text-xs transition-all duration-300 hover:shadow-lg">
              <span class="mr-1">></span>{{ t('read') }}
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
