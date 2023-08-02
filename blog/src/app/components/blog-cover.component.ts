import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PostAttributes } from '../models/post.model';
import { ContentFile } from '@analogjs/content';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'blog-cover',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLinkWithHref],
  host: {
    class: 'p-0',
  },
  template: `<div class="card lg:w-96 bg-base-100 shadow-xl">
    <figure>
      <img
        [ngSrc]="post.attributes.coverImage"
        width="500"
        height="264"
        alt="Cover Image" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ post.attributes.title }}</h2>
      <p>{{ post.attributes.description }}</p>
      <div class="card-actions justify-between jus items-center">
        <div class="badge badge-outline">{{ post.attributes.date | date }}</div>
        <button [routerLink]="post.attributes.slug" class="btn btn-primary">
          Read
        </button>
      </div>
    </div>
  </div>`,
})
export class BlogCoverComponent {
  @Input({ required: true }) post!: ContentFile<PostAttributes>;
}
