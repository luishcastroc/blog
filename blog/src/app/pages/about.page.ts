import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [TranslocoDirective],
  host: { class: 'justify-center' },
  template: `
    <ng-container *transloco="let t; read: 'about'">
      <div
        class="text-primary-content container flex flex-auto flex-col gap-6 px-2 pt-16 md:px-24">
        <header>
          <h1
            class="before:bg-primary after:bg-primary relative w-fit text-4xl font-bold
            before:absolute before:left-[95%] before:top-[70%] before:-z-10 before:h-5
            before:w-5 before:translate-y-0 before:transition-all before:duration-500 after:absolute after:left-[-20px] after:top-[70%] after:-z-10
            after:h-5 after:w-5 after:translate-y-0 after:transition-all
            after:duration-500 hover:before:translate-y-[-20px] hover:after:translate-y-[-20px] md:text-5xl">
            {{ t('header') }}
          </h1>
        </header>
        <section class="flex flex-col gap-6">
          <h2 class="text-3xl font-bold">{{ t('subheader') }}</h2>
          <p>
            {{ t('general-one') }}
            <span class="font-extrabold">Luis Haroldo Castro Cabrera</span>
            {{ t('general-two') }}
          </p>

          <p>
            {{ t('general-three') }}
          </p>

          <p>
            {{ t('general-fourth') }}
          </p>
        </section>

        <section class="flex flex-col gap-6">
          <h2 class="text-3xl font-bold">{{ t('personal.header') }}</h2>
          <p>
            {{ t('personal.content') }}
          </p>

          <p>
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
