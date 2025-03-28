import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SvgIconComponent } from '@ngneat/svg-icon';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'app-blog-footer',
  imports: [SvgIconComponent, NgOptimizedImage, TranslocoDirective],
  host: {
    class: 'z-[99]',
  },
  template: `
    <ng-container *transloco="let t; read: 'footer'">
      <footer class="footer footer-center bg-primary text-primary-content p-10">
        <div>
          <div class="avatar">
            <div
              class="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
              <img
                ngSrc="v1691434864/logo.svg"
                width="80"
                height="80"
                aria-label="logo" />
            </div>
          </div>
          <p class="font-bold">Luis H. Castro. <br />{{ t('slogan') }}</p>
          <p>Copyright © {{ year }} - {{ t('copyright') }}</p>
        </div>
        <div>
          <ul class="grid grid-flow-col text-base xl:gap-8">
            <li class="hover:text-base-100 w-16 hover:transition-all">
              <a
                href="https://twitter.com/LuisHCCDev"
                target="_blank"
                rel="noreferrer noopener"
                attr.aria-label="{{ t('aria-label-twitter') }}">
                <svg-icon key="twitter" fontSize="30px" height="30px" />
              </a>
            </li>
            <li class="hover:text-base-100 w-16 hover:transition-all">
              <a
                href="https://github.com/luishcastroc"
                target="_blank"
                rel="noreferrer noopener"
                attr.aria-label="{{ t('aria-label-github') }}">
                <svg-icon key="github" fontSize="30px" height="30px" />
              </a>
            </li>
            <li class="hover:text-base-100 w-16 hover:transition-all">
              <a
                href="https://www.threads.net/@luishccdev"
                target="_blank"
                rel="noreferrer noopener"
                attr.aria-label="{{ t('aria-label-threads') }}">
                <svg-icon key="threads" fontSize="30px" height="30px" />
              </a>
            </li>
            <li class="hover:text-base-100 w-16 hover:transition-all">
              <a
                href="https://www.linkedin.com/in/luis-castro-cabrera/"
                target="_blank"
                rel="noreferrer noopener"
                attr.aria-label="{{ t('aria-label-linkedin') }}">
                <svg-icon key="linkedin" fontSize="30px" height="30px" />
              </a>
            </li>
            <li class="hover:text-base-100 w-16 hover:transition-all">
              <a
                href="https://bsky.app/profile/mrrobot.dev"
                target="_blank"
                rel="noreferrer noopener"
                attr.aria-label="{{ t('aria-label-bsky') }}">
                <svg-icon key="bluesky" fontSize="30px" height="30px" />
              </a>
            </li>
          </ul>
        </div>
        <div>
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
