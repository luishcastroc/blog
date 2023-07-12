import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sr-blog',
  standalone: true,
  imports: [CommonModule],
  template: `<p>blog works!</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogIndexPage {}
