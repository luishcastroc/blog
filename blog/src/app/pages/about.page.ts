import {
  Component,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-about',
  host: { class: 'justify-center' },
  template: `
    <div class="mx-auto flex w-full max-w-3xl flex-auto flex-col gap-6">
      <header class="flex flex-col gap-2">
        <p class="nb-kicker text-red-ink">/about</p>
        <h1
          class="font-display text-5xl font-extrabold leading-none text-ink md:text-6xl"
          i18n="@@about.header">
          About Me!!
        </h1>
      </header>

      <section class="nb-panel flex flex-col gap-4">
        <h2
          class="font-display text-2xl font-extrabold text-ink"
          i18n="@@about.subheader">
          Professional Background
        </h2>
        <p class="text-ink">
          <span i18n="@@about.general-one">Hello there! My name is</span>
          <span class="nb-mark">Luis Haroldo Castro Cabrera</span>
          <span i18n="@@about.general-two"
            >(long name right?) and I'm a passionate software engineer, with a
            diverse experience span of over 12 years, now proudly residing in
            the sunny Tampa, Florida. Originally from Mexico, I've bridged
            borders not only geographically but also within the world of
            programming languages.</span
          >
        </p>
        <p class="text-ink" i18n="@@about.general-three">
          I specialize in JavaScript, Angular and React, as they resonate with
          my quest for creating seamless user experiences and dynamic software
          solutions. Yet, my expertise doesn't stop there. I have a rich
          background in SQL and PL/SQL, making my skillset broad and versatile.
        </p>
        <p class="text-ink" i18n="@@about.general-fourth">
          I've been incredibly fortunate to work extensively in the healthcare
          and finance industries. This has given me the opportunity to
          understand the unique challenges and constraints these sectors face,
          thereby enabling me to design effective and efficient solutions. It's
          been an enriching journey to develop software that has a real-world
          impact, helping businesses to optimize their operations and customers
          to enjoy better services.
        </p>
      </section>

      <section class="nb-panel flex flex-col gap-4">
        <h2
          class="font-display text-2xl font-extrabold text-ink"
          i18n="@@about.personal.header">
          Personal Interests
        </h2>
        <p class="text-ink" i18n="@@about.personal.content">
          While I'm not architecting software systems or troubleshooting code,
          you'll probably find me deeply engrossed in a thrilling soccer match
          or immersed in an exciting video game. The same passion I bring to my
          professional work is reflected in my love for these activities.
        </p>
        <p class="text-ink" i18n="@@about.personal.content-two">
          I believe in lifelong learning and continuously challenge myself to
          improve. I strive to be better every day.
        </p>
      </section>

      <section class="nb-panel flex flex-col gap-4">
        <h2
          class="font-display text-2xl font-extrabold text-ink"
          i18n="@@about.family.header">
          Family Life
        </h2>
        <p class="text-ink" i18n="@@about.family.content">
          When it comes to my personal life, I am blessed with a beautiful
          family - my loving wife Helly, our two wonderful children, and not to
          forget, our playful puppy Porkchop. They are the source of my daily
          inspiration and the cheerleaders behind my professional success.
        </p>
      </section>
    </div>
  `,
})
export default class AboutPage {
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle($localize`:@@title.about:Luis Castro - About`);
  }
}
