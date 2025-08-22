import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [TranslocoDirective],
  host: { class: 'justify-center' },
  template: `
    <ng-container *transloco="let t; read: 'about'">
      <div
        class="text-base-content font-terminal container flex flex-auto flex-col gap-6 px-2 pt-16 md:px-24">
        <header>
          <h1
            class="text-base-content font-terminal glitch-effect before:bg-secondary after:bg-secondary relative w-fit text-4xl font-bold
            before:absolute before:left-[95%] before:top-[70%] before:-z-10 before:h-5
            before:w-5 before:translate-y-0 before:transition-all before:duration-500 after:absolute after:left-[-20px] after:top-[70%] after:-z-10
            after:h-5 after:w-5 after:translate-y-0 after:transition-all
            after:duration-500 hover:before:translate-y-[-20px] hover:after:translate-y-[-20px] md:text-5xl"
            [attr.data-text]="t('header')">
            {{ t('header') }}
          </h1>
        </header>
        <section class="flex flex-col gap-6">
          <h2 class="font-terminal text-base-content text-3xl font-bold">
            {{ t('subheader') }}
          </h2>
          <p class="font-terminal text-base-content">
            {{ t('general-one') }}
            <span class="cyberpunk-highlight px-1 font-extrabold"
              >Luis Haroldo Castro Cabrera</span
            >
            {{ t('general-two') }}
          </p>

          <p class="font-terminal text-base-content">
            {{ t('general-three') }}
          </p>

          <p class="font-terminal text-base-content">
            {{ t('general-fourth') }}
          </p>
        </section>

        <section class="flex flex-col gap-6">
          <h2 class="font-terminal text-base-content text-3xl font-bold">
            {{ t('personal.header') }}
          </h2>
          <p class="font-terminal text-base-content">
            {{ t('personal.content') }}
          </p>

          <p class="font-terminal text-base-content">
            {{ t('personal.content-two') }}
          </p>
        </section>

        <section class="flex flex-col gap-6">
          <h2 class="text-3xl font-bold">{{ t('family.header') }}</h2>
          <p>
            {{ t('family.content') }}
          </p>
        </section>
      </div>
    </ng-container>
  `,
})
export default class AboutPage {
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle('Luis Castro - About');
  }
}
