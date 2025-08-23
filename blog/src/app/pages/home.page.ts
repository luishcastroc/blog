import {
  Component,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [TranslocoDirective],
  template: `
    <ng-container *transloco="let t; read: 'home'">
      <section class="z-10 flex w-full flex-1 flex-col">
        <div class="hero flex-1">
          <div class="bg-opacity-60"></div>
          <div class="hero-content text-base-content">
            <div
              class="glass-hero relative max-w-md rounded-lg p-8 md:max-w-[80%]">
              <!-- Stylized Welcome Header -->
              <div class="welcome-header mb-6 text-center">
                <h1
                  class="text-secondary font-terminal welcome-text relative
                           mb-3 text-4xl font-bold
                           sm:text-5xl md:text-6xl lg:text-7xl">
                  {{ t('header.welcome') }}
                </h1>
                <div
                  class="text-secondary font-terminal text-lg font-bold md:text-2xl lg:text-3xl">
                  {{ t('header.name') }}
                </div>
              </div>
              <p
                class="text-base-content font-terminal mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('subheader.first') }}
                <span
                  class="cyberpunk-highlight inline-block skew-y-1 border-none px-2 font-extrabold"
                  >{{ t('subheader.second') }}</span
                >
                {{ t('subheader.third') }}
              </p>
              <p
                class="text-base-content font-terminal mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('more.first') }}
                <span
                  class="hacker-text inline-block skew-y-1 border-none px-2 font-extrabold"
                  >{{ t('more.second') }}</span
                >{{ t('more.third') }}
                <span
                  class="cyberpunk-highlight inline-block skew-y-1 border-none px-2 font-extrabold"
                  >{{ t('more.fourth') }}</span
                >
                {{ t('more.fifth') }}
              </p>
              <p
                class="text-base-content font-terminal mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('mission') }}
              </p>
              <p
                class="text-base-content font-terminal mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('conclusion') }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </ng-container>
  `,
})
export default class HomePage {
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle('Luis Castro - Home');
  }
}
