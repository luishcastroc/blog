import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { SvgIconComponent } from '@ngneat/svg-icon';

@Component({
  selector: 'mr-footer',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, NgOptimizedImage],
  host: {
    class: 'z-[99]',
  },
  template: `<footer
    class="footer footer-center bg-primary text-primary-content p-10">
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
      <p class="font-bold">
        Luis H. Castro. <br />Providing solutions inside the madworld of tech
        since 2007.
      </p>
      <p>Copyright © 2023 - All right reserved</p>
    </div>
    <div>
      <ul class="grid grid-flow-col text-base xl:gap-8">
        <li class="hover:text-base-100 w-16 hover:transition-all">
          <a
            href="https://twitter.com/LuisHCCDev"
            target="_blank"
            rel="noreferrer noopener"
            ><svg-icon
              key="twitter"
              fontSize="30px"
              height="30px"
              aria-label="Luis's Twitter Profile"
          /></a>
        </li>
        <li class="hover:text-base-100 w-16 hover:transition-all">
          <a
            href="https://github.com/luishcastroc"
            target="_blank"
            rel="noreferrer noopener"
            ><svg-icon
              key="github"
              fontSize="30px"
              height="30px"
              aria-label="Luis's GitHub Profile"
          /></a>
        </li>
        <li class="hover:text-base-100 w-16 hover:transition-all">
          <a
            href="https://www.threads.net/@luishccdev"
            target="_blank"
            rel="noreferrer noopener"
            ><svg-icon
              key="threads"
              fontSize="30px"
              height="30px"
              aria-label="Luis's Threads Profile"
          /></a>
        </li>
        <li class="hover:text-base-100 w-16 hover:transition-all">
          <a
            href="https://www.linkedin.com/in/luis-castro-cabrera/"
            target="_blank"
            rel="noreferrer noopener"
            ><svg-icon
              key="linkedin"
              fontSize="30px"
              height="30px"
              aria-label="Luis's LinkedIn Profile"
          /></a>
        </li>
      </ul>
    </div>
    <div>
      <a href="https://analogjs.org/" target="_blank" rel="noreferrer noopener"
        ><img
          ngSrc="v1691434864/powered_by_analog.png"
          width="119"
          height="34.5"
          alt="Powered by Analog Image"
      /></a>
    </div>
  </footer>`,
})
export class FooterComponent {}
