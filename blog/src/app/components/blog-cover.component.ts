import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostAttributes } from '../models/post.model';
import { ContentFile } from '@analogjs/content';

@Component({
  selector: 'blog-cover',
  standalone: true,
  imports: [CommonModule],
  template: `<p>blog-cover works!</p>`,
  styles: [],
})
export class BlogCoverComponent {
  @Input({ required: true }) post!: ContentFile<PostAttributes>;
}
