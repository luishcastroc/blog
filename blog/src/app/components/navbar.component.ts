import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { NgClass, NgFor } from '@angular/common';
import { SvgIconComponent } from '@ngneat/svg-icon';
import { ThemeButtonComponent } from './theme-button.component';
import { TranslateButtonComponent } from './translate-button.component';
import { TranslocoModule } from '@ngneat/transloco';
import {
  NavigationEnd,
  Router,
  RouterLinkActive,
  RouterLinkWithHref,
} from '@angular/router';

@Component({
  selector: 'mr-navbar',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLinkWithHref,
    SvgIconComponent,
    NgClass,
    NgFor,
    TranslocoModule,
    ThemeButtonComponent,
    TranslateButtonComponent,
  ],
  template: ` <nav class="navbar bg-primary text-primary-content max-h-20">
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
        <ng-container *transloco="let t; read: 'navigation'">
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[99] mt-3 w-52 p-2 shadow"
            role="menu">
            <li *ngFor="let link of links">
              <a
                href="{{ link.path }}"
                [class.active]="activeLink === link.path"
                (click)="linkClick($event, dropdownButton, link.path)"
                >{{ t(link.name) }}</a
              >
            </li>
          </ul>
        </ng-container>
      </div>
      <ul class="menu menu-horizontal hidden px-1 text-base lg:flex xl:gap-8">
        <ng-container *transloco="let t; read: 'navigation'">
          <li
            *ngFor="let link of links"
            class="relative block w-fit text-xl after:absolute after:block after:h-[3px] after:w-full after:origin-center after:scale-x-0 after:bg-black after:transition after:duration-300 after:content-[''] after:hover:[&:not(&:has(a.active))]:scale-x-100">
            <a
              routerLink="{{ link.path }}"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="hover:outline-none hover:[&:not(.active)]:bg-transparent"
              >{{ t(link.name) }}</a
            >
          </li>
        </ng-container>
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
      <ul class="menu menu-horizontal px-1 text-base">
        <li>
          <mr-translate-button class="pl-0 hover:bg-transparent" />
        </li>
        <li><mr-theme-button class="pl-0 hover:bg-transparent" /></li>
      </ul>
    </div>
  </nav>`,
  host: {
    class: 'z-[100]',
  },
})
export class NavbarComponent {
  links = [
    { name: 'home', path: '/home' },
    { name: 'blog', path: '/blog' },
    { name: 'about', path: '/about' },
    { name: 'contact', path: '/contact' },
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
}
