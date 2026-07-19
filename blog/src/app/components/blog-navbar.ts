import {
  afterNextRender,
  Component,
  DOCUMENT,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { filter } from 'rxjs';

import { ThemeButtonComponent } from './theme-button';
import { TranslateButtonComponent } from './translate-button';

@Component({
  selector: 'app-blog-navbar',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    TranslateButtonComponent,
    ThemeButtonComponent,
  ],
  host: {
    class:
      'z-[1000] sticky top-0 block bg-paper px-4 pb-3 pt-6 sm:px-8 md:px-12 lg:px-6',
  },
  template: `
    <nav
      class="nb-block nb-reveal relative flex items-center justify-between gap-2 px-3 py-2 md:px-4"
      aria-label="Main">
      <!-- Left: logo + desktop links -->
      <div class="flex min-w-0 items-center gap-3">
        <a
          routerLink="/home"
          aria-label="Luis Castro — home"
          class="nb-press flex h-11 w-11 flex-shrink-0 items-center justify-center border-2 border-ink bg-surface md:h-12 md:w-12">
          <img
            src="assets/logo.svg"
            width="28"
            height="28"
            alt=""
            class="h-7 w-7" />
        </a>

        <ul class="hidden items-center gap-2 lg:flex">
          <li>
            <a
              class="nb-navlink"
              routerLink="/home"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              [routerLinkActiveOptions]="{ exact: true }"
              i18n="@@navigation.home">
              Home
            </a>
          </li>
          <li>
            <a
              class="nb-navlink"
              routerLink="/blog"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              [routerLinkActiveOptions]="{ exact: true }"
              i18n="@@navigation.blog">
              Blog
            </a>
          </li>
          <li>
            <a
              class="nb-navlink"
              routerLink="/about"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              [routerLinkActiveOptions]="{ exact: true }"
              i18n="@@navigation.about">
              About
            </a>
          </li>
          <li>
            <a
              class="nb-navlink"
              routerLink="/contact"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              [routerLinkActiveOptions]="{ exact: true }"
              i18n="@@navigation.contact">
              Contact
            </a>
          </li>
        </ul>
      </div>

      <!-- Right: language, theme, mobile menu -->
      <div class="flex flex-shrink-0 items-center gap-2">
        <app-translate-button />
        <app-theme-button />

        <div #dropdown class="nb-dropdown lg:hidden">
          <button
            type="button"
            class="nb-btn nb-btn--ghost nb-btn--square"
            [attr.aria-expanded]="menuOpen()"
            aria-haspopup="menu"
            i18n-aria-label="@@navigation.menu"
            aria-label="Menu"
            (click)="toggleMobileMenu(dropdown)">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              aria-hidden="true">
              @if (menuOpen()) {
                <path d="M6 6l12 12M18 6L6 18" />
              } @else {
                <path d="M3 6h18M3 12h18M3 18h18" />
              }
            </svg>
          </button>

          <ul
            class="nb-menu"
            role="menu"
            i18n-aria-label="@@navigation.menu"
            aria-label="Menu">
            <li role="none">
              <a
                role="menuitem"
                class="nb-menu__item"
                routerLink="/home"
                routerLinkActive="active"
                ariaCurrentWhenActive="page"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="handleMobileLinkClick($event, dropdown, '/home')"
                i18n="@@navigation.home">
                Home
              </a>
            </li>
            <li role="none">
              <a
                role="menuitem"
                class="nb-menu__item"
                routerLink="/blog"
                routerLinkActive="active"
                ariaCurrentWhenActive="page"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="handleMobileLinkClick($event, dropdown, '/blog')"
                i18n="@@navigation.blog">
                Blog
              </a>
            </li>
            <li role="none">
              <a
                role="menuitem"
                class="nb-menu__item"
                routerLink="/about"
                routerLinkActive="active"
                ariaCurrentWhenActive="page"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="handleMobileLinkClick($event, dropdown, '/about')"
                i18n="@@navigation.about">
                About
              </a>
            </li>
            <li role="none">
              <a
                role="menuitem"
                class="nb-menu__item"
                routerLink="/contact"
                routerLinkActive="active"
                ariaCurrentWhenActive="page"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="handleMobileLinkClick($event, dropdown, '/contact')"
                i18n="@@navigation.contact">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
})
export class BlogNavbarComponent {
  currentRoute = '';
  menuOpen = signal(false);
  private router = inject(Router);
  private currentMobileMenuElement: HTMLDivElement | null = null;
  private document = inject(DOCUMENT);

  constructor() {
    afterNextRender(() => {
      this.initializeRouteTracking();
    });
  }

  /**
   * Listen for clicks outside the mobile menu to close it
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (
      this.currentMobileMenuElement &&
      this.currentMobileMenuElement.classList.contains('dropdown-open')
    ) {
      const target = event.target as Element;

      // Check if click is outside the dropdown
      if (!this.currentMobileMenuElement.contains(target)) {
        this.closeMobileMenu(this.currentMobileMenuElement);
      }
    }
  }

  /**
   * Listen for escape key to close the mobile menu
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (
      this.currentMobileMenuElement &&
      this.currentMobileMenuElement.classList.contains('dropdown-open')
    ) {
      this.closeMobileMenu(this.currentMobileMenuElement);
      event.preventDefault();
    }
  }

  /**
   * Initializes route tracking to keep navigation state in sync
   */
  private initializeRouteTracking(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  /**
   * Toggles the mobile dropdown menu state
   */
  toggleMobileMenu(menuElement: HTMLDivElement): void {
    const isOpen = menuElement.classList.contains('dropdown-open');

    // Store reference to current menu element
    this.currentMobileMenuElement = menuElement;

    if (isOpen) {
      this.closeMobileMenu(menuElement);
    } else {
      this.openMobileMenu(menuElement);
    }

    this.blurActiveElement();
  }

  /**
   * Opens the mobile dropdown menu. It's a small overlay panel, so we don't
   * lock body scroll — doing that removes the scrollbar and shifts the layout.
   */
  private openMobileMenu(menuElement: HTMLDivElement): void {
    menuElement.classList.add('dropdown-open');
    this.menuOpen.set(true);
  }

  /**
   * Closes the mobile dropdown menu.
   */
  private closeMobileMenu(menuElement: HTMLDivElement): void {
    menuElement.classList.remove('dropdown-open');
    this.menuOpen.set(false);
    this.currentMobileMenuElement = null;
  }

  /**
   * Handles mobile menu link clicks
   */
  handleMobileLinkClick(
    event: Event,
    menuElement: HTMLDivElement,
    route: string
  ): void {
    event.preventDefault();
    event.stopPropagation();

    // Close the menu first
    this.closeMobileMenu(menuElement);

    // Navigate to the route
    this.router.navigate([route]);
  }

  /**
   * Removes focus from the currently active element
   */
  private blurActiveElement(): void {
    if (this.document.activeElement instanceof HTMLElement) {
      this.document.activeElement.blur();
    }
  }
}
