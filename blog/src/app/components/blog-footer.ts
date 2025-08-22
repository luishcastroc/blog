import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';
import { SvgIconComponent } from '@ngneat/svg-icon';

@Component({
  standalone: true,
  selector: 'app-blog-footer',
  imports: [SvgIconComponent, NgOptimizedImage, TranslocoDirective],
  host: {
    class: 'z-[99]',
  },
  template: `
    <ng-container *transloco="let t; read: 'footer'">
      <footer
        class="footer footer-center bg-base-100 border-primary text-base-content border-t-2 p-10 shadow-2xl">
        <div>
          <div class="avatar">
            <div
              class="ring-primary ring-offset-base-100 border-primary w-24 rounded-none border shadow-lg ring-2 ring-offset-2">
              <img
                ngSrc="v1691434864/logo.svg"
                width="80"
                height="80"
                aria-label="logo"
                class="contrast-110 brightness-110 filter" />
            </div>
          </div>
          <p class="font-terminal text-lg font-bold">
            <span class="text-primary">&gt; </span>Luis H. Castro<span
              class="text-primary"
              >_</span
            >
            <br />
            <span class="text-secondary font-normal">{{ t('slogan') }}</span>
          </p>
          <p class="font-terminal text-sm opacity-70">
            <span class="text-primary">Copyright © {{ year }}</span> -
            {{ t('copyright') }}
          </p>
        </div>
        <div>
          <ul class="grid grid-flow-col text-base xl:gap-8">
            <li
              class="hover:text-primary w-16 hover:scale-110 hover:drop-shadow-lg hover:transition-all">
              <a
                href="https://twitter.com/LuisHCCDev"
                target="_blank"
                rel="noreferrer noopener"
                class="transition-all duration-300"
                attr.aria-label="{{ t('aria-label-twitter') }}">
                <svg-icon key="twitter" fontSize="30px" height="30px" />
              </a>
            </li>
            <li
              class="hover:text-primary w-16 hover:scale-110 hover:drop-shadow-lg hover:transition-all">
              <a
                href="https://github.com/luishcastroc"
                target="_blank"
                rel="noreferrer noopener"
                class="transition-all duration-300"
                attr.aria-label="{{ t('aria-label-github') }}">
                <svg-icon key="github" fontSize="30px" height="30px" />
              </a>
            </li>
            <li
              class="hover:text-primary w-16 hover:scale-110 hover:drop-shadow-lg hover:transition-all">
              <a
                href="https://www.threads.net/@luishccdev"
                target="_blank"
                rel="noreferrer noopener"
                class="transition-all duration-300"
                attr.aria-label="{{ t('aria-label-threads') }}">
                <svg-icon key="threads" fontSize="30px" height="30px" />
              </a>
            </li>
            <li
              class="hover:text-primary w-16 hover:scale-110 hover:drop-shadow-lg hover:transition-all">
              <a
                href="https://www.linkedin.com/in/luis-castro-cabrera/"
                target="_blank"
                rel="noreferrer noopener"
                class="transition-all duration-300"
                attr.aria-label="{{ t('aria-label-linkedin') }}">
                <svg-icon key="linkedin" fontSize="30px" height="30px" />
              </a>
            </li>
            <li
              class="hover:text-primary w-16 hover:scale-110 hover:drop-shadow-lg hover:transition-all">
              <a
                href="https://bsky.app/profile/mrrobot.dev"
                target="_blank"
                rel="noreferrer noopener"
                class="transition-all duration-300"
                attr.aria-label="{{ t('aria-label-bsky') }}">
                <svg-icon key="bluesky" fontSize="30px" height="30px" />
              </a>
            </li>
          </ul>
        </div>
        <div
          class="opacity-80 transition-opacity duration-300 hover:opacity-100">
          <a
            href="https://analogjs.org/"
            target="_blank"
            rel="noreferrer noopener"
            ><img
              ngSrc="v1691434864/powered_by_analog.png"
              width="119"
              height="34.5"
              alt="{{ t('alt-powered-by-analog') }}"
          /></a>
        </div>
      </footer>
    </ng-container>
  `,
})
export class BlogFooterComponent {
  year = new Date().getFullYear();
}
