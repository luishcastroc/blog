import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BlogFooterComponent } from './blog-footer';
import { BlogNavbarComponent } from './blog-navbar';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [RouterOutlet, BlogFooterComponent, BlogNavbarComponent],
  host: {
    class: 'flex min-h-[100dvh] flex-col bg-paper text-ink',
  },
  template: `
    <!-- Skip link: first tab stop, visible only on focus -->
    <a
      href="#main"
      class="nb-btn nb-btn--primary sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[2000]"
      i18n="@@navigation.skip">
      Skip to content
    </a>
    <div class="flex w-full flex-auto flex-col">
      <app-blog-navbar />
      <main id="main" role="main" class="relative flex flex-auto flex-col">
        <router-outlet />
      </main>
      <app-blog-footer />
    </div>
  `,
})
export class DashboardComponent {}
