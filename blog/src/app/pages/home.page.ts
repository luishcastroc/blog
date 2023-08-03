import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Home',
};

@Component({
  standalone: true,
  imports: [],
  template: `
    <section class="flex flex-col flex-1 pt-6 w-full z-10">
      <div class="hero flex-1">
        <div class="bg-opacity-60"></div>
        <div class="hero-content text-primary-content">
          <div class="max-w-md md:max-w-[80%]">
            <h1
              class="mb-5 text-3xl md:text-5xl font-bold w-fit before:w-5 before:h-5
          before:bg-primary before:absolute before:top-[70%] before:left-[98%] before:-z-10
          after:w-5 after:h-5 after:bg-primary after:absolute after:top-[70%] after:left-[-15px] after:-z-10 relative
          before:transition-all before:duration-500 before:translate-y-0 hover:before:translate-y-[-20px]
          after:transition-all after:duration-500 after:translate-y-0 hover:after:translate-y-[-20px]">
              Welcome! I'm Luis Castro
            </h1>
            <p class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
              I'm a
              <span
                class="font-extrabold inline-block bg-secondary text-secondary-content skew-y-3 border-none"
                >dedicated</span
              >
              software engineer with over a decade of experience.
            </p>
            <p class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
              Originally from
              <span
                class="font-extrabold text-black inline-block bg-gradient-to-r from-green-600 via-white to-red-600 skew-y-3 border-none"
                >México</span
              >, now residing in the United States, I thrive on new
              technologies, particularly
              <span
                class="font-extrabold inline-block bg-secondary text-secondary-content skew-y-3 border-none"
                >Angular</span
              >
              and JavaScript.
            </p>
            <p class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
              My mission is to create efficient, scalable, and user-friendly web
              applications, transforming visions into reality.
            </p>
            <p class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
              When I'm not deep in code or keeping up with the latest tech
              trends, you might catch me in a heated soccer (fútbol!) match or
              masterfully playing a video game (if my kids and wife allow me).
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export default class HomeIndexPage {}
