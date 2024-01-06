import { Component, inject, Renderer2 } from '@angular/core';
import { fromEvent, map, startWith } from 'rxjs';
import { NgClass } from '@angular/common';
import { SvgIconComponent } from '@ngneat/svg-icon';
import { TranslocoDirective, TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'mr-theme-button',
  standalone: true,
  imports: [SvgIconComponent, NgClass, TranslocoDirective],
  template: `<ng-container *transloco="let t; read: 'navigation'">
    <button
      class="btn btn-square btn-ghost relative h-[46px]  w-10 overflow-hidden md:w-16"
      [attr.aria-label]="t('aria-label')"
      (click)="changeTheme()">
      <svg-icon
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        [ngClass]="{
          'translate-y-[20%] rotate-[50deg] opacity-0 transition-all':
            isDarkMode,
          'opacity-[1] transition-all duration-1000 ease-out': !isDarkMode
        }"
        key="dark-mode"
        fontSize="30px"
        height="30px" />
      <svg-icon
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        [ngClass]="{
          'opacity-[1] transition-all duration-1000 ease-out': isDarkMode,
          'translate-y-[20%] rotate-[100deg] opacity-0 transition-all':
            !isDarkMode
        }"
        key="light"
        fontSize="30px"
        height="30px" />
    </button>
  </ng-container> `,
})
export class ThemeButtonComponent {
  #renderer = inject(Renderer2);
  isDarkMode = false;

  constructor() {
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

      // Set the initial theme based on the system preference
      this.changeTheme(darkThemeQuery.matches);
    }
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
