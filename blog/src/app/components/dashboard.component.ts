import { NgClass, NgFor } from '@angular/common';
import { Component, Renderer2, inject } from '@angular/core';
import {
  RouterLinkActive,
  RouterLinkWithHref,
  RouterOutlet,
} from '@angular/router';
import { SvgIconComponent } from '@ngneat/svg-icon';

@Component({
  selector: 'blog-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLinkWithHref,
    RouterLinkActive,
    NgFor,
    SvgIconComponent,
    NgClass,
  ],
  host: {
    class: 'flex min-h-screen flex-col',
  },
  template: `
    <main class="flex flex-col flex-auto pt-6 absolute w-full z-10">
      <nav class="navbar bg-primary text-primary-content max-h-20">
        <div class="navbar-start justify-end mr-3">
          <ul class="menu menu-horizontal px-1 text-base gap-8">
            <li
              class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:[&:not(&:has(a.active))]:scale-x-100 after:transition after:duration-300 after:origin-center">
              <a
                routerLink="/home"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="hover:outline-none hover:bg-transparent"
                >Homepage</a
              >
            </li>
            <li
              class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:[&:not(&:has(a.active))]:scale-x-100 after:transition after:duration-300 after:origin-center">
              <a
                routerLink="/blog"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="hover:outline-none hover:bg-transparent"
                >Blog</a
              >
            </li>
            <li
              class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:[&:not(&:has(a.active))]:scale-x-100 after:transition after:duration-300 after:origin-center">
              <a
                routerLink="/about"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="hover:outline-none hover:bg-transparent"
                >About</a
              >
            </li>
            <li
              class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:[&:not(&:has(a.active))]:scale-x-100 after:transition after:duration-300 after:origin-center">
              <a
                routerLink="/contact"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="hover:outline-none hover:bg-transparent"
                >Contact</a
              >
            </li>
          </ul>
        </div>
        <div class="navbar-center mr-4 ml-4">
          <div class="avatar">
            <div
              class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-secondary-focus hover:w-28 hover:h-auto hover:transition-all">
              <a routerLink="/home"
                ><img
                  src="assets/logo.svg"
                  width="80"
                  height="80"
                  aria-label="logo"
              /></a>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <ul class="menu menu-horizontal px-1 text-base gap-8">
            <li class="w-16">
              <a
                href="https://twitter.com/LuisHCCDev"
                target="_blank"
                rel="noreferrer noopener"
                ><svg-icon
                  key="twitter"
                  fontSize="30px"
                  height="30px"
                  aria-label="twitter"
              /></a>
            </li>
            <li class="w-16">
              <a
                href="https://github.com/luishcastroc"
                target="_blank"
                rel="noreferrer noopener"
                ><svg-icon
                  key="github"
                  fontSize="30px"
                  height="30px"
                  aria-label="github"
              /></a>
            </li>
            <li class="w-16">
              <a
                href="https://www.threads.net/@luishccdev"
                target="_blank"
                rel="noreferrer noopener"
                ><svg-icon
                  key="threads"
                  fontSize="30px"
                  height="30px"
                  aria-label="threads"
              /></a>
            </li>
            <li class="w-16">
              <button
                class="btn btn-square btn-ghost w-full h-[46px] relative overflow-hidden"
                (click)="changeTheme()">
                <svg-icon
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  [ngClass]="{
                    'opacity-0 transition-all translate-y-[20%] rotate-[50deg] ease-out duration-1000': isDarkMode,
                    'opacity-[1] transition-all ease-out duration-1000': !isDarkMode,
                  }"
                  key="dark-mode"
                  fontSize="30px"
                  height="30px"
                  aria-label="Chage theme to dark" />
                <svg-icon
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  [ngClass]="{
                    'opacity-[1] transition-all ease-out duration-1000':
                      isDarkMode,
                    'opacity-0 transition-all translate-y-[20%] rotate-[100deg]':
                      !isDarkMode
                  }"
                  key="light"
                  fontSize="30px"
                  height="30px"
                  aria-label="Change theme to light" />
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <router-outlet></router-outlet>
    </main>
    <!-- Animated circles container -->
    <div class="circle-container">
      <ul class="circles">
        <li *ngFor="let number of numbers"></li>
      </ul>
    </div>
  `,
})
export class DashboardComponent {
  #renderer = inject(Renderer2);
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  isDarkMode = false;

  changeTheme() {
    const body = this.#renderer.selectRootElement('body', true) as HTMLElement;
    if (body.getAttribute('data-theme') === 'dark') {
      body.setAttribute('data-theme', 'bumblebee');
      this.isDarkMode = false;
    } else {
      body.setAttribute('data-theme', 'dark');
      this.isDarkMode = true;
    }
  }
}
