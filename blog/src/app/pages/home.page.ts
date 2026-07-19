import {
  Component,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <section
      class="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center">
      <div class="nb-panel flex flex-col gap-6">
        <header class="flex flex-col gap-3">
          <p class="nb-kicker text-red-ink" i18n="@@home.header.welcome">
            WELCOME
          </p>
          <h1
            class="font-display text-4xl font-extrabold leading-none text-ink sm:text-6xl lg:text-7xl"
            i18n="@@home.header.name">
            I'm Luis Castro
          </h1>
          <span
            class="block h-2.5 w-28 border-2 border-ink bg-red"
            aria-hidden="true"></span>
        </header>

        <p class="text-lg leading-relaxed text-ink md:text-xl">
          <span i18n="@@home.subheader.first">I'm a</span>
          <span class="nb-mark" i18n="@@home.subheader.second">dedicated</span>
          <span i18n="@@home.subheader.third"
            >software engineer with over a decade of experience.</span
          >
        </p>
        <p class="text-lg leading-relaxed text-ink md:text-xl">
          <span i18n="@@home.more.first">Originally from</span>
          <span class="nb-mark" i18n="@@home.more.second">México</span
          ><span i18n="@@home.more.third"
            >, now residing in the United States, I thrive on new technologies,
            particularly</span
          >
          <span class="nb-mark" i18n="@@home.more.fourth">Angular</span>
          <span i18n="@@home.more.fifth">and JavaScript.</span>
        </p>
        <p
          class="text-lg leading-relaxed text-muted md:text-xl"
          i18n="@@home.mission">
          My mission is to create efficient, scalable, and user-friendly web
          applications, transforming visions into reality.
        </p>
        <p
          class="text-lg leading-relaxed text-muted md:text-xl"
          i18n="@@home.conclusion">
          When I'm not deep in code or keeping up with the latest tech trends,
          you might catch me in a heated soccer (fútbol!) match or masterfully
          playing a video game (if my kids and wife allow me).
        </p>
      </div>
    </section>
  `,
})
export default class HomePage {
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle($localize`:@@title.home:Luis Castro - Home`);
  }
}
