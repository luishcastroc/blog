import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-blog',
  imports: [RouterOutlet],
  template: `
    <div class="flex flex-auto flex-col overflow-auto lg:flex-row">
      <router-outlet />
    </div>
  `,
})
export default class BlogPage {
  private titleService = inject(Title);
  private meta = inject(Meta);

  constructor() {
    this.titleService.setTitle('Luis Castro - Blog');
    this.meta.addTag({ name: 'description', content: 'Blog Posts' });
  }
}
