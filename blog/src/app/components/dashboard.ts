import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlogFooterComponent } from './blog-footer';
import { BlogNavbarComponent } from './blog-navbar';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [RouterOutlet, BlogFooterComponent, BlogNavbarComponent],
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
  template: `
    <main class="z-10 flex w-full flex-auto flex-col pt-6">
      <app-blog-navbar />
      <div class="relative flex flex-auto">
        <router-outlet />
        <!-- Animated circles container -->
        <div class="circle-container fixed">
          <ul class="circles">
            @for (number of numbers; track $index) {
              <li></li>
            }
          </ul>
        </div>
      </div>
      <app-blog-footer />
    </main>
  `,
})
export class DashboardComponent {
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
}
