import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

import { SvgIconComponent } from '@ngneat/svg-icon';

@Component({
  standalone: true,
  selector: 'app-blog-footer',
  imports: [SvgIconComponent, NgOptimizedImage],
  host: {
    // Pinned to the viewport bottom on larger screens (compact row); normal
    // flow on mobile, where the stacked footer is too tall to pin.
    class:
      'z-[99] block bg-paper px-4 pb-6 pt-3 sm:px-8 md:sticky md:bottom-0 md:px-12 lg:px-6',
  },
  template: `
    <footer
      class="nb-block nb-reveal flex flex-col items-center gap-6 p-6 text-center md:flex-row md:justify-between md:text-left">
      <!-- Identity -->
      <div class="flex items-center gap-4">
        <div
          class="flex h-16 w-16 flex-shrink-0 items-center justify-center border-3 border-ink bg-red">
          <img
            ngSrc="v1691434864/logo.svg"
            width="40"
            height="40"
            alt=""
            class="h-10 w-10" />
        </div>
        <div>
          <p class="font-display text-lg font-extrabold text-ink">
            Luis H. Castro
          </p>
          <p class="font-mono text-sm text-muted" i18n="@@footer.slogan">
            Providing solutions inside the madworld of tech since 2007.
          </p>
          <p class="font-mono text-xs text-muted">
            © {{ year }} —
            <span i18n="@@footer.copyright">All right reserved</span>
          </p>
        </div>
      </div>

      <!-- Social -->
      <ul class="flex items-center gap-3">
        <li>
          <a
            href="https://twitter.com/LuisHCCDev"
            target="_blank"
            rel="noreferrer noopener"
            class="nb-press flex h-12 w-12 items-center justify-center border-3 border-ink bg-surface text-ink hover:bg-red hover:text-on-red"
            i18n-aria-label="@@footer.aria-label-twitter"
            aria-label="Luis's Twitter Profile">
            <svg-icon key="twitter" fontSize="26px" height="26px" />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/luishcastroc"
            target="_blank"
            rel="noreferrer noopener"
            class="nb-press flex h-12 w-12 items-center justify-center border-3 border-ink bg-surface text-ink hover:bg-red hover:text-on-red"
            i18n-aria-label="@@footer.aria-label-github"
            aria-label="Luis's Github Profile">
            <svg-icon key="github" fontSize="26px" height="26px" />
          </a>
        </li>
        <li>
          <a
            href="https://www.threads.net/@luishccdev"
            target="_blank"
            rel="noreferrer noopener"
            class="nb-press flex h-12 w-12 items-center justify-center border-3 border-ink bg-surface text-ink hover:bg-red hover:text-on-red"
            i18n-aria-label="@@footer.aria-label-threads"
            aria-label="Luis's Threads Profile">
            <svg-icon key="threads" fontSize="26px" height="26px" />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/luis-castro-cabrera/"
            target="_blank"
            rel="noreferrer noopener"
            class="nb-press flex h-12 w-12 items-center justify-center border-3 border-ink bg-surface text-ink hover:bg-red hover:text-on-red"
            i18n-aria-label="@@footer.aria-label-linkedin"
            aria-label="Luis's LinkedIn Profile">
            <svg-icon key="linkedin" fontSize="26px" height="26px" />
          </a>
        </li>
        <li>
          <a
            href="https://bsky.app/profile/mrrobot.dev"
            target="_blank"
            rel="noreferrer noopener"
            class="nb-press flex h-12 w-12 items-center justify-center border-3 border-ink bg-surface text-ink hover:bg-red hover:text-on-red"
            i18n-aria-label="@@footer.aria-label-bsky"
            aria-label="Luis's Bluesky Profile">
            <svg-icon key="bluesky" fontSize="26px" height="26px" />
          </a>
        </li>
      </ul>

      <!-- Credit -->
      <a
        href="https://analogjs.org/"
        target="_blank"
        rel="noreferrer noopener"
        class="nb-press inline-flex border-3 border-ink bg-surface p-2"
        i18n-aria-label="@@footer.alt-powered-by-analog"
        aria-label="Powered by Analog">
        <img
          ngSrc="v1691434864/powered_by_analog.png"
          width="119"
          height="34.5"
          i18n-alt="@@footer.alt-powered-by-analog"
          alt="Powered by Analog" />
      </a>
    </footer>
  `,
})
export class BlogFooterComponent {
  year = new Date().getFullYear();
}
