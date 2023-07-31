import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  template: `
    <section class="flex flex-col flex-1 pt-6 w-full z-10">
      <div class="hero flex-1">
        <div class="bg-opacity-60"></div>
        <div class="hero-content text-primary-content">
          <div class="max-w-md md:max-w-[80%]">
            <h1 class="mb-5 text-3xl md:text-5xl font-bold">
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
