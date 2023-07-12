import { Component } from '@angular/core';
import {
  RouterLinkActive,
  RouterLinkWithHref,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'blog-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  host: {
    class: 'flex min-h-screen flex-col',
  },
  template: `
    <main class="flex flex-col flex-auto pt-6">
      <nav class="navbar bg-primary text-primary-content max-h-20">
        <div class="navbar-start justify-end mr-3">
          <ul class="menu menu-horizontal px-1 text-base gap-8">
            <li
              class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
            >
              <a
                routerLink="/home"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="hover:outline-none hover:bg-transparent"
                >Homepage</a
              >
            </li>
            <li
              class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
            >
              <a
                routerLink="/blog"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="hover:outline-none hover:bg-transparent"
                >Blog</a
              >
            </li>
            <li
              class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
            >
              <a
                routerLink="/about"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="hover:outline-none hover:bg-transparent"
                >About</a
              >
            </li>
            <li
              class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
            >
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
              class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-secondary-focus hover:w-28 hover:h-auto hover:transition-all"
            >
              <a routerLink="/home"
                ><img src="assets/logo.svg" width="80" height="80"
              /></a>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <ul class="menu menu-horizontal px-1 text-base gap-8">
            <li>
              <a
                href="https://twitter.com/LuisHCCDev"
                target="_blank"
                rel="noreferrer noopener"
                ><img
                  src="assets/twitter.svg"
                  width="30px"
                  height="30px"
                  alt="twitter"
              /></a>
            </li>
            <li>
              <a
                href="https://github.com/luishcastroc"
                target="_blank"
                rel="noreferrer noopener"
                ><img
                  src="assets/github.svg"
                  width="30px"
                  height="30px"
                  alt="github"
              /></a>
            </li>
            <li>
              <a
                href="https://www.threads.net/@luishccdev"
                target="_blank"
                rel="noreferrer noopener"
                ><img
                  src="assets/threads.svg"
                  width="30px"
                  height="30px"
                  alt="threads"
              /></a>
            </li>
          </ul>
        </div>
      </nav>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class DashboardComponent {}
