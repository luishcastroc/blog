import {
  Component,
  inject,
} from '@angular/core';
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
        class="text-base-content font-terminal glass-hero container relative flex flex-auto flex-col gap-6 rounded-lg px-2 py-16 md:px-24">
        <header>
          <!-- Stylized About Header like Welcome -->
          <div class="welcome-header mb-6 text-center">
            <h1
              class="text-secondary font-terminal welcome-text relative
                       mb-3 text-4xl font-bold
                       sm:text-5xl md:text-6xl lg:text-7xl"
              [attr.data-text]="t('header')">
              {{ t('header') }}
            </h1>
          </div>
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
