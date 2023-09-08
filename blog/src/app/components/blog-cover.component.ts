import { Component, Input } from '@angular/core';
import { ContentFile } from '@analogjs/content';
import { DatePipe, NgIf, NgOptimizedImage } from '@angular/common';
import { DateTime } from 'luxon';
import { PostAttributes } from '../models/post.model';
import { RouterLinkWithHref } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'mr-cover',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    RouterLinkWithHref,
    DatePipe,
    TranslocoModule,
  ],
  host: {
    class: 'p-0',
  },
  template: ` <ng-container *transloco="let t; read: 'blog'"
    ><div
      class="bg-primary absolute z-50 flex h-10 w-16 animate-bounce items-center justify-center rounded-lg font-bold"
      *ngIf="isNew(post.attributes.date)">
      {{ t('new') }}
    </div>
    <div class="card bg-base-100 relative h-[490px] shadow-xl lg:w-96">
      <figure class="flex-none">
        <img
          [ngSrc]="post.attributes.coverImage"
          width="500"
          height="210"
          alt="{{ t('alt') }}" />
      </figure>
      <div class="card-body p-4">
        <h2 class="card-title">{{ post.attributes.title }}</h2>
        <p>{{ post.attributes.description }}</p>
        <div class="card-actions jus items-center justify-between">
          <div class="badge badge-outline">
            {{ post.attributes.date | date }}
          </div>
          <button [routerLink]="post.attributes.slug" class="btn btn-primary">
            {{ t('read') }}
          </button>
        </div>
      </div>
    </div></ng-container
  >`,
})
export class BlogCoverComponent {
  @Input({ required: true }) post!: ContentFile<PostAttributes>;

  //method that returns true if the date is >= today - 7 days using luxon
  isNew(date: string) {
    const today = DateTime.now();
    const sevenDaysAgo = today.minus({ days: 7 });
    const postDate = DateTime.fromISO(date);
    return postDate >= sevenDaysAgo;
  }
}
