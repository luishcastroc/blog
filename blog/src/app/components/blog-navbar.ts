import {
  afterNextRender,
  Component,
  HostListener,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { filter } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';

import { ThemeButtonComponent } from './theme-button';
import { TranslateButtonComponent } from './translate-button';

interface NavigationLink {
  name: string;
  path: string;
}

@Component({
  selector: 'app-blog-navbar',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    TranslocoDirective,
    TranslateButtonComponent,
    ThemeButtonComponent,
  ],
  host: {
    class: 'z-[1000] relative',
  },
  template: `
    <!-- Terminal-style navbar -->
    <nav
      class="terminal-window-glass bg-base-200 border-base-300 relative flex w-full flex-col border-2 font-mono text-sm shadow-lg"
      role="navigation"
      aria-label="Main navigation">
      <!-- Terminal header bar -->
      <div
        class="bg-base-200 border-base-300 flex items-center justify-between border-b px-4 py-1">
        <div class="flex items-center gap-2">
          <!-- Terminal window controls -->
          <div class="flex gap-1">
            <div class="bg-error h-3 w-3 rounded-full opacity-70"></div>
            <div class="bg-warning h-3 w-3 rounded-full opacity-70"></div>
            <div class="bg-success h-3 w-3 rounded-full opacity-70"></div>
          </div>
          <span class="text-base-content/60 ml-2 text-xs"
            >fsociety&#64;terminal:~$</span
          >
        </div>
        <div class="text-base-content/60 text-xs">
          <span class="hidden sm:inline">Connected to Evil Corp Network</span>
          <span class="sm:hidden">Evil Corp</span>
        </div>
      </div>

      <!-- Main navigation area -->
      <!-- Main navigation area -->
      <div class="relative flex min-h-[4rem] items-center px-4 py-4">
        <!-- Terminal prompt and navigation -->
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <!-- Mobile menu button (terminal style) -->
          <div #dropdownButton class="dropdown flex-shrink-0 lg:hidden">
            <label
              (click)="toggleMobileMenu(dropdownButton)"
              tabindex="0"
              class="btn btn-sm btn-ghost font-terminal text-secondary hover:bg-secondary hover:text-secondary-content transition-all duration-300"
              aria-haspopup="true"
              aria-label="Open terminal menu">
              <span class="text-sm">[MENU]</span>
            </label>
            <ng-container *transloco="let t; read: 'navigation'">
              <ul
                tabindex="0"
                class="menu menu-sm dropdown-content bg-base-300 border-secondary font-terminal z-[99999] mt-2 w-64 border-2 p-0 shadow-2xl"
                role="menu">
                <li class="bg-base-200 border-base-300 border-b px-3 py-2">
                  <span class="text-secondary text-xs font-bold"
                    >NAVIGATION_MENU</span
                  >
                </li>
                @for (link of navigationLinks; track link.path) {
                  <li class="border-base-300 border-b last:border-b-0">
                    <a
                      routerLink="{{ link.path }}"
                      [class.active]="currentRoute === link.path"
                      class="hover:bg-secondary hover:text-secondary-content before:text-secondary cursor-pointer px-4 py-3 text-sm
                             transition-all duration-300 before:mr-2 before:content-['$_']"
                      (click)="
                        handleMobileLinkClick($event, dropdownButton, link.path)
                      ">
                      {{ t(link.name).toUpperCase() }}
                    </a>
                  </li>
                }
              </ul>
            </ng-container>
          </div>

          <!-- Desktop navigation (terminal commands) -->
          <div class="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
            <span class="text-secondary flex-shrink-0 text-sm font-bold"
              >root&#64;fsociety:~$</span
            >
            <ul class="flex items-center gap-3 overflow-hidden">
              <ng-container *transloco="let t; read: 'navigation'">
                @for (link of navigationLinks; track link.path) {
                  <li class="relative flex-shrink-0">
                    <a
                      routerLink="{{ link.path }}"
                      routerLinkActive="active"
                      [routerLinkActiveOptions]="{ exact: true }"
                      class="terminal-command text-base-content hover:text-secondary hover:border-secondary before:text-secondary
                             relative border border-transparent px-2 py-1 font-mono text-sm transition-all
                             duration-300 before:mr-1 before:content-['./']"
                      [attr.data-command]="t(link.name)">
                      {{ t(link.name) }}
                    </a>
                  </li>
                }
              </ng-container>
            </ul>
          </div>
        </div>

        <!-- Center logo (cyberpunk emblem) -->
        <div class="mx-4 flex-shrink-0">
          <div class="group relative">
            <a
              routerLink="/home"
              class="from-base-200 to-base-300 border-base-300 hover:border-secondary group-hover:shadow-secondary/20 before:via-secondary/10
                     relative flex h-16
                     w-20 items-center justify-center
                     overflow-hidden border bg-gradient-to-br
                     transition-all duration-500
                     before:absolute before:inset-0 before:translate-x-[-100%]
                     before:bg-gradient-to-r before:from-transparent before:to-transparent
                     before:transition-transform before:duration-700 hover:before:translate-x-[100%]
                     group-hover:shadow-lg">
              <!-- Background pattern -->
              <div class="absolute inset-0 opacity-5">
                <div
                  class="from-secondary/20 absolute inset-0 bg-gradient-to-br to-transparent"></div>
                <div
                  class="bg-secondary/30 absolute left-0 top-0 h-px w-full"></div>
                <div
                  class="bg-secondary/30 absolute bottom-0 left-0 h-px w-full"></div>
              </div>

              <!-- Logo -->
              <img
                src="assets/logo.svg"
                width="48"
                height="48"
                alt="Luis Castro Dev"
                class="contrast-110 relative z-10 brightness-110 filter transition-all duration-300 group-hover:scale-110" />

              <!-- Corner accents -->
              <div
                class="border-secondary/40 absolute left-1 top-1 h-2 w-2 border-l-2 border-t-2"></div>
              <div
                class="border-secondary/40 absolute right-1 top-1 h-2 w-2 border-r-2 border-t-2"></div>
              <div
                class="border-secondary/40 absolute bottom-1 left-1 h-2 w-2 border-b-2 border-l-2"></div>
              <div
                class="border-secondary/40 absolute bottom-1 right-1 h-2 w-2 border-b-2 border-r-2"></div>

              <!-- Scanning line -->
              <div
                class="bg-secondary/60 absolute left-0 right-0 top-0 h-0.5
                          animate-pulse opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </a>
          </div>
        </div>

        <!-- Right side controls (terminal utilities) -->
        <div class="flex flex-shrink-0 items-center gap-2">
          <div class="text-base-content/60 mr-2 hidden text-xs xl:block">
            <span class="text-secondary text-xs">[CTRL+ALT+T]</span>
          </div>
          <div class="flex gap-2">
            <app-translate-button class="overflow-hidden" />
            <app-theme-button class="overflow-hidden" />
          </div>
        </div>
      </div>

      <!-- Terminal status bar -->
      <div class="bg-base-200 border-base-300 border-t px-4 py-1">
        <div
          class="text-base-content/60 flex items-center justify-between text-xs">
          <div class="flex gap-4">
            <span>STATUS: <span class="text-success">CONNECTED</span></span>
            <span>USER: <span class="text-secondary">root</span></span>
            <span>SHELL: <span class="text-info">/bin/bash</span></span>
          </div>
          <div class="flex gap-2">
            <span class="text-success">●</span>
            <span>Network: 192.168.1.100</span>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class BlogNavbarComponent implements OnDestroy {
  navigationLinks: NavigationLink[] = [
    { name: 'home', path: '/home' },
    { name: 'blog', path: '/blog' },
    { name: 'about', path: '/about' },
    { name: 'contact', path: '/contact' },
  ];

  currentRoute = '';
  private router = inject(Router);
  private currentMobileMenuElement: HTMLDivElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.initializeRouteTracking();
    });
  }

  ngOnDestroy(): void {
    // Restore body scroll when component is destroyed
    document.body.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
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
  onEscapeKey(event: KeyboardEvent): void {
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
   * Opens the mobile menu and prevents body scroll
   */
  private openMobileMenu(menuElement: HTMLDivElement): void {
    menuElement.classList.add('dropdown-open');
    document.body.classList.add('mobile-menu-open');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the mobile menu and restores body scroll
   */
  private closeMobileMenu(menuElement: HTMLDivElement): void {
    menuElement.classList.remove('dropdown-open');
    document.body.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
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
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
