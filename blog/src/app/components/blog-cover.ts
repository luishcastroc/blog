import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DateTime } from 'luxon';

import { ContentFile } from '@analogjs/content';

import { PostAttributes } from '../models/post.model';

@Component({
  standalone: true,
  selector: 'app-blog-cover',
  imports: [NgOptimizedImage, DatePipe, RouterLink],
  host: {
    class: 'block h-full',
  },
  template: `
    <a
      class="nb-card group relative"
      [routerLink]="['/blog', post.attributes.slug]">
      @if (isNew(post.attributes.date)) {
        <span class="nb-badge absolute right-3 top-3 z-10" i18n="@@blog.new"
          >New!!</span
        >
      }

      @if (post.attributes.coverImage) {
        <span class="block border-b-3 border-ink">
          <img
            class="aspect-[500/210] w-full object-cover"
            [ngSrc]="post.attributes.coverImage"
            width="500"
            height="210"
            i18n-alt="@@blog.alt"
            alt="Cover Image" />
        </span>
      }

      <span class="flex flex-1 flex-col gap-3 p-4">
        <span class="nb-chip self-start">
          {{ post.attributes.date | date }}
        </span>
        <h2 class="font-display text-xl font-extrabold leading-tight text-ink">
          {{ post.attributes.title }}
        </h2>
        <p class="text-sm leading-relaxed text-muted">
          {{ post.attributes.description }}
        </p>
        <span
          class="mt-auto inline-flex items-center gap-1 font-mono text-sm font-bold uppercase tracking-wide text-red-ink group-hover:underline">
          <span i18n="@@blog.read">Read</span> →
        </span>
      </span>
    </a>
  `,
})
export class BlogCoverComponent {
  @Input({ required: true }) post!: ContentFile<PostAttributes>;

  // Returns true when the post is within the last 7 days.
  isNew(date: string): boolean {
    const today = DateTime.now();
    const sevenDaysAgo = today.minus({ days: 7 });
    const postDate = DateTime.fromISO(date);
    return postDate >= sevenDaysAgo;
  }
}
