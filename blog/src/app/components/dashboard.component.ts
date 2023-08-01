import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'blog-dashboard',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgFor],
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
  template: `
    <main class="flex flex-col flex-auto pt-6 w-full z-10">
      <sr-navbar />
      <div class="relative">
        <router-outlet></router-outlet>
        <!-- Animated circles container -->
        <div class="circle-container fixed">
          <ul class="circles">
            <li *ngFor="let number of numbers"></li>
          </ul>
        </div>
      </div>
      <sr-footer />
    </main>
  `,
})
export class DashboardComponent {
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
}
