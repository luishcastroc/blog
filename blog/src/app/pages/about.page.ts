import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - About',
};

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="container flex flex-col gap-6 flex-auto px-16 md:px-24 text-primary-content">
      <header>
        <h1
          class="w-fit text-4xl md:text-5xl font-bold before:w-5 before:h-5
          before:bg-primary before:absolute before:top-[70%] before:left-[95%] before:-z-10
          after:w-5 after:h-5 after:bg-primary after:absolute after:top-[70%] after:left-[-20px] after:-z-10 relative
          before:transition-all before:duration-500 before:translate-y-0 hover:before:translate-y-[-20px]
          after:transition-all after:duration-500 after:translate-y-0 hover:after:translate-y-[-20px]">
          About Me!!
        </h1>
      </header>
      <section class="flex flex-col gap-6">
        <h2 class="text-3xl font-bold">Professional Background</h2>
        <p>
          Hello there! My name is
          <span class="font-extrabold">Luis Haroldo Castro Cabrera</span> (long
          name right?) and I'm a passionate software engineer, with a diverse
          experience span of over 12 years, now proudly residing in the sunny
          Tampa, Florida. Originally from Mexico, I've bridged borders not only
          geographically but also within the world of programming languages.
        </p>

        <p>
          I specialize in JavaScript and Angular, as they resonate with my quest
          for creating seamless user experiences and dynamic software solutions.
          Yet, my expertise doesn't stop there. I have a rich background in SQL
          and PL/SQL, making my skillset broad and versatile.
        </p>

        <p>
          I've been incredibly fortunate to work extensively in the healthcare
          and finance industries. This has given me the opportunity to
          understand the unique challenges and constraints these sectors face,
          thereby enabling me to design effective and efficient solutions. It's
          been an enriching journey to develop software that has a real-world
          impact, helping businesses to optimize their operations and customers
          to enjoy better services.
        </p>
      </section>

      <section class="flex flex-col gap-6">
        <h2 class="text-3xl font-bold">Personal Interests</h2>
        <p>
          While I'm not architecting software systems or troubleshooting code,
          you'll probably find me deeply engrossed in a thrilling soccer match
          or immersed in an exciting video game. The same passion I bring to my
          professional work is reflected in my love for these activities.
        </p>

        <p>
          I believe in lifelong learning and continuously challenge myself to
          improve. I strive to be better every day.
        </p>
      </section>

      <section class="flex flex-col gap-6">
        <h2 class="text-3xl font-bold">Family Life</h2>
        <p>
          When it comes to my personal life, I am blessed with a beautiful
          family - my loving wife Helly, our two wonderful children, and not to
          forget, our playful puppy Porkchop. They are the source of my daily
          inspiration and the cheerleaders behind my professional success.
        </p>
      </section>
    </div>
  `,
})
export default class AboutIndexPage {}
