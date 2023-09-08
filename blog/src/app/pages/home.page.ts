import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { TranslocoModule } from '@ngneat/transloco';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Home',
};

@Component({
  standalone: true,
  imports: [TranslocoModule],
  template: `
    <ng-container *transloco="let t; read: 'home'">
      <section class="z-10 flex w-full flex-1 flex-col">
        <div class="hero flex-1">
          <div class="bg-opacity-60"></div>
          <div class="hero-content text-primary-content">
            <div class="max-w-md md:max-w-[80%]">
              <h1
                class="before:bg-primary after:bg-primary relative mb-5 w-fit text-3xl font-bold
                     before:absolute before:left-[98%] before:top-[70%] before:-z-10 before:h-5
                     before:w-5 before:translate-y-0 before:transition-all before:duration-500 after:absolute
                     after:left-[-15px] after:top-[70%] after:-z-10 after:h-5 after:w-5 after:translate-y-0 after:transition-all
                     after:duration-500 hover:before:translate-y-[-20px] hover:after:translate-y-[-20px] md:text-5xl">
                {{ t('header') }}
              </h1>
              <p
                class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('subheader.first') }}
                <span
                  class="bg-secondary text-secondary-content inline-block skew-y-3 border-none font-extrabold"
                  >{{ t('subheader.second') }}</span
                >
                {{ t('subheader.third') }}
              </p>
              <p
                class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('more.first') }}
                <span
                  class="inline-block skew-y-3 border-none bg-gradient-to-r from-green-600 via-white to-red-600 font-extrabold text-black"
                  >{{ t('more.second') }}</span
                >{{ t('more.third') }}
                <span
                  class="bg-secondary text-secondary-content inline-block skew-y-3 border-none font-extrabold"
                  >{{ t('more.fourth') }}</span
                >
                {{ t('more.fifth') }}
              </p>
              <p
                class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('mission') }}
              </p>
              <p
                class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('conclusion') }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </ng-container>
  `,
})
export default class HomeIndexPage {}
