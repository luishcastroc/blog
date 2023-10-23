import { Component } from '@angular/core';
import { FooterComponent } from './footer.component';
import { NavbarComponent } from './navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mr-dashboard',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
  template: `
    <main class="z-10 flex w-full flex-auto flex-col pt-6">
      <mr-navbar />
      <div class="relative flex flex-auto">
        <router-outlet></router-outlet>
        <!-- Animated circles container -->
        <div class="circle-container fixed">
          <ul class="circles">
            @for(number of numbers; track $index){
            <li></li>
            }
          </ul>
        </div>
      </div>
      <mr-footer />
    </main>
  `,
})
export class DashboardComponent {
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
}
