import { NgClass } from '@angular/common';
import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';

import { fromEvent, map, startWith } from 'rxjs';

import { SvgIconComponent } from '@ngneat/svg-icon';

@Component({
  standalone: true,
  selector: 'app-theme-button',
  host: { class: 'flex' },
  imports: [SvgIconComponent, NgClass],
  template: `
    <button
      class="nb-btn nb-btn--ghost nb-btn--square relative overflow-hidden"
      i18n-aria-label="@@navigation.aria-label"
      aria-label="Change theme to dark/light"
      (click)="changeTheme()">
      <svg-icon
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        [ngClass]="{
          'translate-y-[20%] rotate-[50deg] opacity-0 transition-all':
            isDarkMode(),
          'opacity-[1] transition-all duration-1000 ease-out': !isDarkMode(),
        }"
        key="dark-mode"
        fontSize="30px"
        height="30px" />
      <svg-icon
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        [ngClass]="{
          'opacity-[1] transition-all duration-1000 ease-out': isDarkMode(),
          'translate-y-[20%] rotate-[100deg] opacity-0 transition-all':
            !isDarkMode(),
        }"
        key="light"
        fontSize="30px"
        height="30px" />
    </button>
  `,
})
export class ThemeButtonComponent implements OnInit {
  private renderer = inject(Renderer2);
  isDarkMode = signal(false);

  ngOnInit() {
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

      // Set the initial theme based on the system preference
      this.changeTheme(darkThemeQuery.matches);
    }
  }

  changeTheme(theme?: boolean) {
    const body = this.renderer.selectRootElement('body', true) as HTMLElement;

    if (typeof theme === 'undefined') {
      // Toggle the theme if no argument is provided
      theme = body.getAttribute('data-theme') !== 'mr-robot-dark';
    }

    if (theme) {
      body.setAttribute('data-theme', 'mr-robot-dark');
      this.isDarkMode.set(true);
    } else {
      body.setAttribute('data-theme', 'mr-robot-light');
      this.isDarkMode.set(false);
    }
  }
}
