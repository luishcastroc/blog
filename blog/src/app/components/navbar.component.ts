import { Component, Renderer2, inject } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { SvgIconComponent } from '@ngneat/svg-icon';

@Component({
  selector: 'sr-navbar',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLinkWithHref,
    SvgIconComponent,
    NgClass,
    NgFor,
  ],
  template: `<nav class="navbar bg-primary text-primary-content max-h-20">
    <div class="navbar-start lg:justify-end mr-3">
      <div class="dropdown lg:hidden">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </label>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[99] p-2 shadow bg-base-100 rounded-box w-52">
          <li *ngFor="let link of links">
            <a
              routerLink="{{ link.path }}"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              >{{ link.name }}</a
            >
          </li>
        </ul>
      </div>
      <ul class="menu menu-horizontal px-1 text-base xl:gap-8 hidden lg:flex">
        <li
          class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:[&:not(&:has(a.active))]:scale-x-100 after:transition after:duration-300 after:origin-center">
          <a
            routerLink="/home"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="hover:outline-none hover:[&:not(.active)]:bg-transparent"
            >Home</a
          >
        </li>
        <li
          class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:[&:not(&:has(a.active))]:scale-x-100 after:transition after:duration-300 after:origin-center">
          <a
            routerLink="/blog"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="hover:outline-none hover:[&:not(.active)]:bg-transparent"
            >Blog</a
          >
        </li>
        <li
          class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:[&:not(&:has(a.active))]:scale-x-100 after:transition after:duration-300 after:origin-center">
          <a
            routerLink="/about"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="hover:outline-none hover:[&:not(.active)]:bg-transparent"
            >About</a
          >
        </li>
        <li
          class="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:[&:not(&:has(a.active))]:scale-x-100 after:transition after:duration-300 after:origin-center">
          <a
            routerLink="/contact"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="hover:outline-none hover:[&:not(.active)]:bg-transparent"
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
      <ul class="menu menu-horizontal px-1 text-base xl:gap-8">
        <li class="w-16">
          <button
            class="btn btn-square btn-ghost w-full h-[46px] relative overflow-hidden"
            (click)="changeTheme()">
            <svg-icon
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              [ngClass]="{
              'opacity-0 transition-all translate-y-[20%] rotate-[50deg]': isDarkMode,
              'opacity-[1] transition-all ease-out duration-1000': !isDarkMode,
            }"
              key="dark-mode"
              fontSize="30px"
              height="30px"
              aria-label="Chage theme to dark" />
            <svg-icon
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              [ngClass]="{
                'opacity-[1] transition-all ease-out duration-1000': isDarkMode,
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
  </nav>`,
  host: {
    class: 'z-[100]',
  },
})
export class NavbarComponent {
  #renderer = inject(Renderer2);
  isDarkMode = false;
  links = [
    { name: 'Home', path: '/home' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

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
