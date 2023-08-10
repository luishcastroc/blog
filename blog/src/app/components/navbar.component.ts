import { Component, inject, Renderer2 } from '@angular/core';
import { filter, fromEvent, map, startWith } from 'rxjs';
import { NgClass, NgFor } from '@angular/common';
import { SvgIconComponent } from '@ngneat/svg-icon';
import {
  NavigationEnd,
  Router,
  RouterLinkActive,
  RouterLinkWithHref,
} from '@angular/router';

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
    <div class="navbar-start mr-3 lg:justify-end">
      <div #dropdownButton class="dropdown lg:hidden">
        <label
          (click)="toggleDropdown(dropdownButton)"
          tabindex="0"
          class="btn btn-ghost btn-circle"
          aria-haspopup="true"
          aria-label="Open menu"
          aria-expanded="false">
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
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[99] mt-3 w-52 p-2 shadow"
          role="menu">
          <li *ngFor="let link of links">
            <a
              [class.active]="activeLink === link.path"
              (click)="linkClick($event, dropdownButton, link.path)"
              >{{ link.name }}</a
            >
          </li>
        </ul>
      </div>
      <ul class="menu menu-horizontal hidden px-1 text-base lg:flex xl:gap-8">
        <li
          *ngFor="let link of links"
          class="relative block w-fit text-xl after:absolute after:block after:h-[3px] after:w-full after:origin-center after:scale-x-0 after:bg-black after:transition after:duration-300 after:content-[''] after:hover:[&:not(&:has(a.active))]:scale-x-100">
          <a
            routerLink="{{ link.path }}"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="hover:outline-none hover:[&:not(.active)]:bg-transparent"
            >{{ link.name }}</a
          >
        </li>
      </ul>
    </div>
    <div class="navbar-center ml-4 mr-4">
      <div class="avatar">
        <div
          class="ring-primary ring-offset-base-100 hover:ring-secondary-focus w-24 rounded-full ring ring-offset-2 hover:h-auto hover:w-28 hover:transition-all">
          <a routerLink="/home"
            ><img
              src="assets/logo.svg"
              width="80"
              height="80"
              alt="Luis H. Castro Dev logo"
              aria-label="Luis H. Castro Dev logo"
          /></a>
        </div>
      </div>
    </div>
    <div class="navbar-end">
      <ul class="menu menu-horizontal px-1 text-base xl:gap-8">
        <li class="w-16">
          <button
            class="btn btn-square btn-ghost relative h-[46px] w-full overflow-hidden"
            aria-label="Change theme"
            (click)="changeTheme()">
            <svg-icon
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              [ngClass]="{
              'translate-y-[20%] rotate-[50deg] opacity-0 transition-all': isDarkMode,
              'opacity-[1] transition-all duration-1000 ease-out': !isDarkMode,
            }"
              key="dark-mode"
              fontSize="30px"
              height="30px"
              aria-label="Chage theme to dark" />
            <svg-icon
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              [ngClass]="{
                'opacity-[1] transition-all duration-1000 ease-out': isDarkMode,
                'translate-y-[20%] rotate-[100deg] opacity-0 transition-all':
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

  activeLink = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.activeLink = event.urlAfterRedirects;
      });

    //be sure you're running inside a browser
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      //check the system theme
      const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      //listen for changes
      fromEvent<MediaQueryList>(darkThemeQuery, 'change')
        .pipe(
          startWith(darkThemeQuery),
          map((list: MediaQueryList) => list.matches)
        )
        .subscribe(isDarkMode => {
          this.changeTheme(isDarkMode);
        });
    }
  }

  toggleDropdown(button: HTMLDivElement) {
    button.classList.toggle('dropdown-open');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  linkClick(event: Event, parent: HTMLDivElement, route: string) {
    event.preventDefault();
    this.toggleDropdown(parent);
    this.router.navigate([route]);
  }

  changeTheme(theme?: boolean) {
    const body = this.#renderer.selectRootElement('body', true) as HTMLElement;

    if (typeof theme === 'undefined') {
      // Toggle the theme if no argument is provided
      theme = body.getAttribute('data-theme') !== 'dark';
    }

    if (theme) {
      body.setAttribute('data-theme', 'dark');
      this.isDarkMode = true;
    } else {
      body.setAttribute('data-theme', 'bumblebee');
      this.isDarkMode = false;
    }
  }
}
