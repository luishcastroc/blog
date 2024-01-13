---
title: Lets talk about NG
slug: lets-talk-about-ng
otherSlug: hablemos-de-ng
description: Discovering a new way of authoring your angular components, using the NG component authoring feature in AnalogJs.
author: Luis Castro
coverImage: v1705169936/analog-ng.png
date: 01-13-2024
---

## Controversy in Angular Framework

Controversy typically refers to situations with strong disagreement or conflicting opinions. In technology, such controversies often arise when a popular (or unpopular) framework like Angular undergoes changes or faces challenges. Today, we're diving into one such aspect of Angular that's sparking both interest and debate: NG component authoring.

One day you're chilling and scrolling twitter and you find this:

<p style="display:flex; flex-direction:column; justify-content:center; align-items:center">
<img src="https://res.cloudinary.com/lhcc0134/image/upload/v1705170492/ng-first-idea.png" width="500px" height="auto" 
        alt="Ng first idea" />
</p>

But then you comeback to twitter after some vacation time to find this:

<p style="display:flex; flex-direction:column; justify-content:center; align-items:center;">
<img src="https://res.cloudinary.com/lhcc0134/image/upload/v1705170492/ng-official.png" width="500px" height="auto"
        alt="Ng Annoucement" />
</p>

## Specific Areas of Controversy in Angular

- **Learning Curve**: Angular's architecture is more complex and has a steeper learning curve compared to other frameworks, like React. This complexity can be frustrating for beginners, leading to criticism from those who prefer simpler options. The Angular team is actively working to improve this, focusing on the Angular renaissance.

- **Framework Opinions**: Angular's approach to structuring and organizing code is more "opinionated." While this leads to greater consistency and maintainability, it can feel restrictive to developers who prefer more freedom and flexibility.

- **Competition**: The JavaScript framework landscape is constantly evolving, with newer options like React and Vue.js gaining popularity. This leads to comparisons and debates about which framework is "better," sometimes casting Angular in a negative light.

But we're not here to start a debate; we're here to talk about something that might change how you write your Angular components.

## Analog Js, Here We Go Again

If you've read my blog posts (I don't have many), you know I'm a huge fan of Angular and contribute to a meta-framework called [AnalogJs](https://analogjs.org/). AnalogJs is a full-stack meta-framework designed to enhance the Angular experience for building applications and websites. Alongside other meta-frameworks, Analog takes Angular to a different level, including features like:

- **Vite/Vitest/Playwright Support**: Analog integrates seamlessly with modern development tools such as Vite, Vitest, and Playwright, ensuring a smooth workflow.

- **File-Based Routing**: Analog simplifies routing with a file-based system, allowing for a more intuitive navigation structure.

- **Markdown as Content Routes**: Analog enables the use of markdown files as content routes, streamlining content management.

- **API/Server Routes Support**: Analog supports API and server routes, enhancing the framework's versatility for backend needs.

- **Hybrid SSR/SSG Support**: Analog provides hybrid support for Server-Side Rendering (SSR) and Static Site Generation (SSG), catering to various deployment needs.

- **Angular CLI/Nx Workspace Compatibility**: Fully compatible with Angular CLI and Nx workspaces, Analog integrates effortlessly into existing Angular ecosystems.

- **Support for Angular Components with Astro**: Analog embraces the latest web technology, supporting Angular components within Astro, expanding the framework's capabilities.

However, its creator and maintainer, [Brandon Roberts](https://twitter.com/brandontroberts), along with another super-smart GDE, [Chau Tran](https://twitter.com/Nartc1410), started working on a new feature that might change the way you write your Angular components. This feature could also set a clear path for what Analog could mean for the Angular community: the NG component authoring (not sure if that's the proper term, but I'll take my chances here).

## What is NG Component Authoring?

First, let's discuss how a component is written in Angular. You have a component that looks like this:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world', // The selector is used in HTML to instantiate this component
  templateUrl: './hello-world.component.html', // Path to the HTML template, this can be an inline template as well,
  template: `<h1>Hello, Angular!</h1>`, // Inline template
  standalone: true, // This is a standalone component, it doesn't need to be imported in any module
  imports: [CommonModule], // This component imports the CommonModule
  styleUrls: ['./hello-world.component.css'], // Path to the styles for this component
})
export class HelloWorldComponent {
  message: string; // Component property, accessible in the template

  constructor() {
    this.message = 'Hello, Angular!'; // Initialize properties in the constructor
  }

  // You can add methods here, which can be called from the template
  sayHello() {
    alert(this.message);
  }
}
```

Most likely I'm missing some stuff, but you get the idea. In Angular, you have a class that has a decorator, which tells Angular how to instantiate this component, which template and styles to use, what modules to import, etc. Unlike React, Vue.js, or Svelte, this approach to component creation in Angular is often perceived as the most difficult. It's not necessarily because it's inherently hard, but rather because it's not as intuitive. You need to learn quite a bit before you can effectively write a component in Angular. And that's exactly where NG component authoring comes into play.

Highly inspired by Vue and Svelte, **Brandon** and **Chau** have delivered this neat feature that looks like this:

```ts
<script lang="ts">
  import { inject, signal, effect, computed } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { JsonPipe } from '@angular/common';
  import { RouterOutlet, RouterLink } from '@angular/router';
  import { delay } from 'rxjs';

  import Hello from './hello.ng';
  import AnotherOne from './another-one.ng';
  import Highlight from './highlight.ng';
  import { HelloOriginal } from './hello';

  defineMetadata({
    selector: 'app-root',
    imports: [JsonPipe, HelloOriginal, RouterOutlet, RouterLink],
    exposes: [Math],
  });

  const title = 'Angular Analog';

  const http = inject(HttpClient);

  const counter = signal(1);
  const doubled = computed(() => counter() * 2);
  const text = computed(() => `The count from parent is: ${counter()}`);
  const todo = signal(null);

  const increment = () => {
    counter.update(value => value + 1);
  };

  function decrement() {
    counter.update(value => value - 1);
  }

  function onClick(event: MouseEvent) {
    console.log('the click from Hello', event);
  }

  effect(() => {
    console.log('counter changed', counter());
  });

  onInit(() => {
    console.log('App init');
    http
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .pipe(delay(2000))
      .subscribe(data => {
        todo.set(data);
        console.log('data', data);
      });
  });
</script>

<template>
  @if (counter() > 5) {
  <Hello [text]="text()" (clicked)="onClick($event)" />
  <AnotherOne />
  <app-hello-original />
  }

  <p>Counter: {{ counter() }}</p>
  <p highlight>Doubled: {{ doubled() }}</p>
  <button (click)="increment()">increment</button>
  <button (click)="decrement()">decrement</button>

  <p>Random: {{ Math.random() }}</p>

  @if (todo(); as todo) {
  <pre>{{todo | json }}</pre>
  } @else {
  <p>Loading todo...</p>
  }

  <br />

  <a routerLink="/">Home</a> | <a routerLink="/about">About</a>

  <br />

  <router-outlet />
</template>

<style>
  p {
    color: red;
  }

  button {
    background: blue;
    color: white;
    padding: 1rem 0.5rem;
    border-radius: 0.5rem;
  }
</style>
```

Weird? yes at first, but let's break it down a little bit, first you have a script tag that looks like this:

```ts
<script lang="ts">
  import { inject, signal, effect, computed } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { JsonPipe } from '@angular/common';
  import { RouterOutlet, RouterLink } from '@angular/router';
  import { delay } from 'rxjs';

  import Hello from './hello.ng';
  import AnotherOne from './another-one.ng';
  import Highlight from './highlight.ng';
  import { HelloOriginal } from './hello';

  defineMetadata({
    selector: 'app-root',
    imports: [JsonPipe, HelloOriginal, RouterOutlet, RouterLink],
    exposes: [Math],
  });

  const title = 'Angular Analog';

  const http = inject(HttpClient);

  const counter = signal(1);
  const doubled = computed(() => counter() * 2);
  const text = computed(() => `The count from parent is: ${counter()}`);
  const todo = signal(null);

  const increment = () => {
    counter.update(value => value + 1);
  };

  function decrement() {
    counter.update(value => value - 1);
  }

  function onClick(event: MouseEvent) {
    console.log('the click from Hello', event);
  }

  effect(() => {
    console.log('counter changed', counter());
  });

  onInit(() => {
    console.log('App init');
    http
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .pipe(delay(2000))
      .subscribe(data => {
        todo.set(data);
        console.log('data', data);
      });
  });
</script>
```

This probably looks familiar to you, right? In Angular, traditionally, you'd work with a class that includes a decorator. But here's where things start to differ: enter the **defineMetadata** function. This function essentially serves the same purpose as the `@Component` decorator but in a new way. Additionally, lifecycle hooks have evolved; they are now callable functions. For instance, **onInit** transforms into a function where you pass a callback. Interesting changes, aren't they? Now, let's move on to the template part:

```ts
<template>
  @if (counter() > 5) {
  <Hello [text]="text()" (clicked)="onClick($event)" />
  <AnotherOne />
  <app-hello-original />
  }

  <p>Counter: {{ counter() }}</p>
  <p highlight>Doubled: {{ doubled() }}</p>
  <button (click)="increment()">increment</button>
  <button (click)="decrement()">decrement</button>

  <p>Random: {{ Math.random() }}</p>

  @if (todo(); as todo) {
  <pre>{{todo | json }}</pre>
  } @else {
  <p>Loading todo...</p>
  }

  <br />

  <a routerLink="/">Home</a> | <a routerLink="/about">About</a>

  <br />

  <router-outlet />
</template>
```

This is where things get interesting. The first thing that comes to my mind is that you're using the Hello component and AnotherOne component without putting them inside the imports array (What kind of sorcery is this??). But it doesn't stop there; you can also use "regular old school" Angular components (those you'll need to put inside the imports array, especially if you're using standalone components). Secondly, you can use the component with the file name (using camelCase) or using a selector... pretty cool, right? This approach is more familiar if you're coming from React or Vue codebases.

And finally, the `<Script>` tag. This one, I think, might be self-explanatory 🧐. This is where you put your styles to make this component look beautiful...

## How Does This Sorcery Work? 📝

Well, the magic happens using a Vite plugin that scans the .ng file, looking for the different tags and transforming this into a regular Angular component. So, Angular never notices that you, a developer, are trying to disrupt the status quo... But don't listen to me; I'm like Jon Snow when it comes to this stuff. So, let's hear it from someone who can explain it a little better than me in this YouTube video: [How to casually change the entire way Angular components work](https://www.youtube.com/watch?v=XoCtEmOvfg4).

## I Want to use it Now! 🤩

Well, first thing to mention, this is experimental, so you might metaphorically burn your house down if you use it in production. But if you're like me and you like to live on the edge, you can start by installing the latest beta version of AnalogJs. Follow the instructions to generate a new Analog app from [here](https://analogjs.org/docs/getting-started) and then update your package.json to use the latest beta (at the time of writing this is 0.2.30-beta.7). Next, go to your vite.config.ts and add the following.

```ts
/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: 'src/assets',
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      ssr: false,
      vite: { experimental: { dangerouslySupportNgFormat: true } },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
```

> **Side Note**: Extra points to Chau and Brandon for emphasizing how experimental this is 😂

## Conclusion

With all the changes that Angular is bringing to the framework, the doors are open for innovators to find new ways of doing things. It all started with AnalogJs, but curiosity and new features made the NG component possible, and I'm sure there's more to come. So, if you're an Angular developer, or even a React, Vue, or Svelte one, give Analog a try; you might be pleasantly surprised.

> **Note**: This is not a paid post; I'm just a fan of the framework and the meta-framework, sharing my thoughts on this.

---

If you found this article insightful, don't hesitate to connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Let's embark on this journey of discovery and innovation together! 💻🚀📘

Feeling generous? Show some love and [buy me a coffee](https://www.buymeacoffee.com/luishcastrv). Your support is greatly cherished! ☕️
