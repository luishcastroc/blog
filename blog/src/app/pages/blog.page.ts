import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-blog',
  imports: [RouterOutlet],
  template: `
    <div class="flex min-w-0 flex-auto flex-col">
      <router-outlet />
    </div>
  `,
})
export default class BlogPage {
  private titleService = inject(Title);
  private meta = inject(Meta);

  constructor() {
    this.titleService.setTitle($localize`:@@title.blog:Luis Castro - Blog`);
    this.meta.addTag({
      name: 'description',
      content: $localize`:@@meta.blog-description:Blog Posts`,
    });
  }
}
