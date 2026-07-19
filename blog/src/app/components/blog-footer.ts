import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

import { SvgIconComponent } from '@ngneat/svg-icon';

@Component({
  standalone: true,
  selector: 'app-blog-footer',
  imports: [SvgIconComponent, NgOptimizedImage],
  host: {
    class: 'z-[99] block bg-paper px-4 pb-4 pt-2 sm:px-8 md:px-12 lg:px-6',
  },
  template: `
    <footer
      class="nb-block nb-reveal flex flex-col items-center gap-4 p-4 text-center md:flex-row md:justify-between md:text-left">
      <!-- Identity -->
      <div class="flex items-center gap-3">
        <div
          class="border-3 border-ink bg-red flex h-12 w-12 shrink-0 items-center justify-center">
          <img
            ngSrc="v1691434864/logo.svg"
            width="32"
            height="32"
            alt=""
            class="h-8 w-8" />
        </div>
        <div>
          <p class="font-display text-ink text-base font-extrabold">
            Luis H. Castro
          </p>
          <p class="text-muted font-mono text-xs" i18n="@@footer.slogan">
            Providing solutions inside the madworld of tech since 2007.
          </p>
          <p class="text-muted font-mono text-xs">
            © {{ year }} —
            <span i18n="@@footer.copyright">All right reserved</span>
          </p>
        </div>
      </div>

      <!-- Social -->
      <ul class="flex items-center gap-2">
        <li>
          <a
            href="https://twitter.com/LuisHCCDev"
            target="_blank"
            rel="noreferrer noopener"
            class="nb-press border-3 border-ink bg-surface text-ink hover:bg-red hover:text-on-red flex h-10 w-10 items-center justify-center"
            i18n-aria-label="@@footer.aria-label-twitter"
            aria-label="Luis's Twitter Profile">
            <svg-icon key="twitter" fontSize="22px" height="22px" />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/luishcastroc"
            target="_blank"
            rel="noreferrer noopener"
            class="nb-press border-3 border-ink bg-surface text-ink hover:bg-red hover:text-on-red flex h-10 w-10 items-center justify-center"
            i18n-aria-label="@@footer.aria-label-github"
            aria-label="Luis's Github Profile">
            <svg-icon key="github" fontSize="22px" height="22px" />
          </a>
        </li>
        <li>
          <a
            href="https://www.threads.net/@luishccdev"
            target="_blank"
            rel="noreferrer noopener"
            class="nb-press border-3 border-ink bg-surface text-ink hover:bg-red hover:text-on-red flex h-10 w-10 items-center justify-center"
            i18n-aria-label="@@footer.aria-label-threads"
            aria-label="Luis's Threads Profile">
            <svg-icon key="threads" fontSize="22px" height="22px" />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/luis-castro-cabrera/"
            target="_blank"
            rel="noreferrer noopener"
            class="nb-press border-3 border-ink bg-surface text-ink hover:bg-red hover:text-on-red flex h-10 w-10 items-center justify-center"
            i18n-aria-label="@@footer.aria-label-linkedin"
            aria-label="Luis's LinkedIn Profile">
            <svg-icon key="linkedin" fontSize="22px" height="22px" />
          </a>
        </li>
        <li>
          <a
            href="https://bsky.app/profile/mrrobot.dev"
            target="_blank"
            rel="noreferrer noopener"
            class="nb-press border-3 border-ink bg-surface text-ink hover:bg-red hover:text-on-red flex h-10 w-10 items-center justify-center"
            i18n-aria-label="@@footer.aria-label-bsky"
            aria-label="Luis's Bluesky Profile">
            <svg-icon key="bluesky" fontSize="22px" height="22px" />
          </a>
        </li>
      </ul>

      <!-- Credit -->
      <a
        href="https://analogjs.org/"
        target="_blank"
        rel="noreferrer noopener"
        class="nb-press border-3 border-ink bg-surface inline-flex p-1"
        i18n-aria-label="@@footer.alt-powered-by-analog"
        aria-label="Powered by Analog">
        <img
          ngSrc="v1691434864/powered_by_analog.png"
          width="96"
          height="28"
          i18n-alt="@@footer.alt-powered-by-analog"
          alt="Powered by Analog" />
      </a>
    </footer>
  `,
})
export class BlogFooterComponent {
  year = new Date().getFullYear();
}
