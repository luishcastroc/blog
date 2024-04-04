---
title: Cambiando a Analog SFC
slug: cambiando-a-analog-sfc
otherSlug: switching-to-analog-sfc
description: Cambiando mi blog para utilizar al máximo los nuevos Analog SFC's con un poco de TanStack también.
author: Luis Castro
coverImage: v1712246484/angular-sfc.png
date: 04-04-2024
---

## 📚Adoptando Analog SFC

**Haciendo el Cambio:**  
Después de algunas dudas iniciales—como la falta de soporte de sintaxis en VSCode, lo cual superé cambiándome a WebStorm (un saludo a su equipo por el increíble plugin de Analog)—decidí que era momento de hacer un gran cambio. Con Brandon Roberts lanzando la versión 1.0 de Analog, sentí que era correcto adoptar completamente Analog SFC para mi blog. Como contribuyente principal de Analog, sentí cierta responsabilidad de predicar con el ejemplo. Si estoy ayudando a construirlo, debería estar usándolo, ¿verdad?

## 🧰 ¿Qué es Analog SFC?

Analog SFC introduce una manera más sencilla de construir componentes de Angular usando un formato de archivo único, marcado por la extensión `.analog`. Está diseñado para hacer la autoría de componentes más directa al reunir el template, script y estilos en un solo lugar. Aquí está lo que lo distingue:

- **Colocación**: Templates, scripts y estilos viven juntos, haciendo que los componentes sean más fáciles de manejar.
- **Sintaxis Simplificada**: No utiliza decoradores de Angular, apuntando a un código más limpio.
- **Optimizaciones de Rendimiento**: Por defecto utiliza configuraciones eficientes como la detección de cambios `OnPush`, evitando ciertos ganchos del ciclo de vida para un mejor rendimiento.

### Empezando

Para sumergirte en Analog SFC, necesitarás herramientas específicas, como el plugin de Analog para Vite o Astro. Aquí tienes una configuración rápida usando Vite:

```typescript
import { defineConfig } from 'vite';
import analog from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    analog({
      experimental: { supportAnalogFormat: true },
    }),
  ],
});
```

## Soporte de IDE

El soporte de IDE es crucial para una experiencia de desarrollo fluida. Por ejemplo, WebStorm e IDEA Ultimate ofrecen soporte para Analog SFC con un plugin para resaltar la sintaxis y más. El soporte para VSCode está en el horizonte, prometiendo una mayor accesibilidad.

## Ejemplo: Construyendo un Contador Simple

El formato Analog SFC destaca por su simplicidad y eficiencia. Aquí tienes un vistazo de cómo se ve un componente contador en este nuevo formato:

```html

<script lang="ts">
  import { signal } from '@angular/core';

  const count = signal(0);

  function add() {
    count.set(count() + 1);
  }
</script>

<template>
  <div class="container">
    <button (click)="add()">{{ count() }}</button>
  </div>
</template>

<style>
  .container {
    display: flex;
    justify-content: center;
  }

  button {
    font-size: 2rem;
    padding: 1rem 2rem;
  }
</style>
```

Este ejemplo encapsula la esencia de Analog SFC: diseño de componentes conciso, cohesivo y de alto rendimiento.

> Aunque los Analog SFC ofrecen un enfoque simplificado para el desarrollo de componentes, es esencial recordar que se trata de una iniciativa experimental impulsada por la comunidad. Como tal, invita a los desarrolladores de Angular a explorar y contribuir, expandiendo las posibilidades dentro del ecosistema de Angular.

## 🔍 Mi Experiencia con Analog SFC

La transición a Analog SFC me mostró una nueva forma (y sinceramente, una bastante genial) de diseño y desarrollo de componentes. Se necesitaron algunos cambios menores, sobre los cuales hablaremos en un momento, pero me sorprendió que todo funcionara igual que antes.

Algunos ejemplos de los cambios se pueden ilustrar aquí:

### Así es como se veía un componente antes:

```ts
import { Component, Input } from '@angular/core';
import { ContentFile } from '@analogjs/content';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { DateTime } from 'luxon';
import { PostAttributes } from '../models/post.model';
import { RouterLinkWithHref } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'mr-cover',
  standalone: true,
  imports: [NgOptimizedImage, RouterLinkWithHref, DatePipe, TranslocoDirective],
  host: {
    class: 'p-0',
  },
  template: ` <ng-container *transloco="let t; read: 'blog'">
    @if (isNew(post.attributes.date)) {
      <div
        class="bg-primary absolute z-50 flex h-10 w-20 animate-bounce items-center justify-center rounded-lg font-bold">
        {{ t('new') }}
      </div>
    }
    <div class="card bg-base-100 relative h-[490px] shadow-xl lg:w-96">
      <figure class="flex-none">
        <img
          class="w-full"
          [ngSrc]="post.attributes.coverImage"
          width="500"
          height="210"
          alt="{{ t('alt') }}" />
      </figure>
      <div class="card-body p-4">
        <h2 class="card-title basis-2/6">{{ post.attributes.title }}</h2>
        <p>{{ post.attributes.description }}</p>
        <div class="card-actions jus items-center justify-between">
          <div class="badge badge-outline">
            {{ post.attributes.date | date }}
          </div>
          <button [routerLink]="post.attributes.slug" class="btn btn-primary">
            {{ t('read') }}
          </button>
        </div>
      </div>
    </div></ng-container
  >`,
})
export class BlogCoverComponent {
  @Input({ required: true }) post!: ContentFile<PostAttributes>;

  //method that returns true if the date is >= today - 7 days using luxon
  isNew(date: string) {
    const today = DateTime.now();
    const sevenDaysAgo = today.minus({ days: 7 });
    const postDate = DateTime.fromISO(date);
    return postDate >= sevenDaysAgo;
  }
}
```

### Así es como se ve ahora:

```html

<script lang="ts">
  import { input } from '@angular/core';
  import { ContentFile } from '@analogjs/content';
  import { DatePipe, NgOptimizedImage } from '@angular/common';
  import { DateTime } from 'luxon';
  import { PostAttributes } from '../models/post.model';
  import { RouterLink } from '@angular/router';
  import { TranslocoDirective } from '@ngneat/transloco';

  defineMetadata({
    imports: [NgOptimizedImage, RouterLink, DatePipe, TranslocoDirective],
    host: {
      class: 'p-0',
    },
  });

  const post = input.required < ContentFile < PostAttributes >> ();

  //method that returns true if the date is >= today - 7 days using luxon
  function isNew(date: string) {
    const today = DateTime.now();
    const sevenDaysAgo = today.minus({ days: 7 });
    const postDate = DateTime.fromISO(date);
    return postDate >= sevenDaysAgo;
  }
</script>

<template>
  <ng-container *transloco="let t; read: 'blog'">
    @if (isNew(post().attributes.date)) {
    <div
      class="bg-primary absolute z-50 flex h-10 w-20 animate-bounce items-center justify-center rounded-lg font-bold">
      {{ t('new') }}
    </div>
    }
    <div class="card bg-base-100 relative h-[490px] shadow-xl lg:w-96">
      <figure class="flex-none">
        <img
          class="w-full"
          [ngSrc]="post().attributes.coverImage"
          width="500"
          height="210"
          alt="{{ t('alt') }}" />
      </figure>
      <div class="card-body p-4">
        <h2 class="card-title basis-2/6">{{ post().attributes.title }}</h2>
        <p>{{ post().attributes.description }}</p>
        <div class="card-actions jus items-center justify-between">
          <div class="badge badge-outline">
            {{ post().attributes.date | date }}
          </div>
          <button [routerLink]="post().attributes.slug" class="btn btn-primary">
            {{ t('read') }}
          </button>
        </div>
      </div>
    </div>
  </ng-container>
</template>
```

Pero primero lo primero, estoy usando Tailwind, así que necesitaba que mis archivos analog fueran reconocidos por el proceso. Por lo tanto, el primer paso fue añadir la extensión al tailwind.config.cjs.

```js
const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html,analog}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['dark', 'bumblebee'],
  },
};
```

Y como mencioné antes, cambié mi vite.config para permitirme el uso de archivos .analog 😁

Después de esos pasos mínimos, simplemente comencé con los componentes menos complicados. Todo allí fue bastante directo, sin complicaciones en absoluto. Un ejemplo sencillo sería mi dashboard:

### Antes:

```ts
import { Component } from '@angular/core';
import { FooterComponent } from './footer.component';
import { NavbarComponent } from './navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mr-dashboard',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
  template: `
    <main class="z-10 flex w-full flex-auto flex-col pt-6">
      <mr-navbar />
      <div class="relative flex flex-auto">
        <router-outlet></router-outlet>
        <!-- Animated circles container -->
        <div class="circle-container fixed">
          <ul class="circles">
            @for(number of numbers; track $index){
            <li></li>
            }
          </ul>
        </div>
      </div>
      <mr-footer />
    </main>
  `,
})
export class DashboardComponent {
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
}
```

### Después:

```html

<script lang="ts">
  import { RouterOutlet } from '@angular/router';
  import BlogFooter from './blog-footer.analog' with { analog: 'imports' };
  import BlogNavbar from './blog-navbar.analog' with { analog: 'imports' };

  defineMetadata({
    imports: [RouterOutlet],
    host: {
      class: 'flex min-h-[100dvh] flex-col',
    },
  });

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
</script>

<template>
  <main class="z-10 flex w-full flex-auto flex-col pt-6">
    <BlogNavbar />
    <div class="relative flex flex-auto">
      <router-outlet />
      <!-- Animated circles container -->
      <div class="circle-container fixed">
        <ul class="circles">
          @for (number of numbers; track $index) {
          <li></li>
          }
        </ul>
      </div>
    </div>
    <BlogFooter />
  </main>
</template>
```

Un par de cosas a mencionar aquí: Puede que hayas notado que el Footer y el Navbar se importan pero no se incluyen en el array de **imports**. Hablando de importaciones, ¿notaste la ausencia de decoradores? Entonces, ¿dónde colocas tus importaciones o proveedores? La respuesta es **defineMetadata**. Considéralo un reemplazo directo del decorador **@Component**. Bastante genial, ¿verdad?

### 🥹 Abordando Ejemplos Más Complejos

Después de completar la mayoría de los componentes solo de UI, era momento de abordar aquellos con un poco más de lógica. En general, incluso mis componentes más pequeños involucran alguna lógica ya que uso **transloco** para gestionar traducciones, lo cual es un elemento común en toda la app.

Sumergámonos en uno de esos ejemplos. Por favor, no juzgues mi código demasiado severamente—todavía estoy aprendiendo a usar señales. Puede que no siempre las use de la mejor manera, pero hey, funciona, jaja. Estoy abierto a cualquier consejo que puedas tener.

### Antes:

```ts
import { Component, inject, Renderer2 } from '@angular/core';
import { fromEvent, map, startWith } from 'rxjs';
import { NgClass } from '@angular/common';
import { SvgIconComponent } from '@ngneat/svg-icon';
import { TranslocoDirective, TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'mr-theme-button',
  standalone: true,
  imports: [SvgIconComponent, NgClass, TranslocoDirective],
  template: `<ng-container *transloco="let t; read: 'navigation'">
    <button
      class="btn btn-square btn-ghost relative h-[46px]  w-10 overflow-hidden md:w-16"
      [attr.aria-label]="t('aria-label')"
      (click)="changeTheme()">
      <svg-icon
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        [ngClass]="{
          'translate-y-[20%] rotate-[50deg] opacity-0 transition-all':
            isDarkMode,
          'opacity-[1] transition-all duration-1000 ease-out': !isDarkMode
        }"
        key="dark-mode"
        fontSize="30px"
        height="30px" />
      <svg-icon
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        [ngClass]="{
          'opacity-[1] transition-all duration-1000 ease-out': isDarkMode,
          'translate-y-[20%] rotate-[100deg] opacity-0 transition-all':
            !isDarkMode
        }"
        key="light"
        fontSize="30px"
        height="30px" />
    </button>
  </ng-container> `,
})
export class ThemeButtonComponent {
  #renderer = inject(Renderer2);
  isDarkMode = false;

  constructor() {
    //be sure you're running inside a browser
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      //check the system theme
      const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      //listen for changes
      fromEvent<MediaQueryList>(darkThemeQuery, 'change')
        .pipe(
          startWith(darkThemeQuery),
          map((list: MediaQueryList) => list.matches)
        )
        .subscribe(isDarkMode => {
          this.changeTheme(isDarkMode);
        });

      // Set the initial theme based on the system preference
      this.changeTheme(darkThemeQuery.matches);
    }
  }

  changeTheme(theme?: boolean) {
    const body = this.#renderer.selectRootElement('body', true) as HTMLElement;

    if (typeof theme === 'undefined') {
      // Toggle the theme if no argument is provided
      theme = body.getAttribute('data-theme') !== 'dark';
    }

    if (theme) {
      body.setAttribute('data-theme', 'dark');
      this.isDarkMode = true;
    } else {
      body.setAttribute('data-theme', 'bumblebee');
      this.isDarkMode = false;
    }
  }
}
```

### Después

```html

<script lang="ts">
  import { afterNextRender, inject, Renderer2 } from '@angular/core';
  import { fromEvent, map, startWith } from 'rxjs';
  import { SvgIconComponent } from '@ngneat/svg-icon';
  import { NgClass } from '@angular/common';
  import { TranslocoDirective } from '@ngneat/transloco';

  defineMetadata({ imports: [SvgIconComponent, NgClass, TranslocoDirective] });

  const renderer = inject(Renderer2);
  let isDarkMode = false;

  afterNextRender(() => {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      //check the system theme
      const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      //listen for changes
      fromEvent < MediaQueryList > (darkThemeQuery, 'change')
        .pipe(
          startWith(darkThemeQuery),
          map((list: MediaQueryList) => list.matches),
        )
        .subscribe(isDarkMode => {
          changeTheme(isDarkMode);
        });

      // Set the initial theme based on the system preference
      changeTheme(darkThemeQuery.matches);
    }
  });

  function changeTheme(theme

    ? : boolean
  )
  {
    const body = renderer.selectRootElement('body', true)
    as
    HTMLElement;

    if (typeof theme === 'undefined') {
      // Toggle the theme if no argument is provided
      theme = body.getAttribute('data-theme') !== 'dark';
    }

    if (theme) {
      body.setAttribute('data-theme', 'dark');
      isDarkMode = true;
    } else {
      body.setAttribute('data-theme', 'bumblebee');
      isDarkMode = false;
    }
  }
</script>

<template>
  <ng-container *transloco="let t; read: 'navigation'">
    <button
      class="btn btn-square btn-ghost relative h-[46px]  w-10 overflow-hidden md:w-16"
      [attr.aria-label]="t('aria-label')"
      (click)="changeTheme()">
      <svg-icon
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        [ngClass]="{
          'translate-y-[20%] rotate-[50deg] opacity-0 transition-all':
            isDarkMode,
          'opacity-[1] transition-all duration-1000 ease-out': !isDarkMode
        }"
        key="dark-mode"
        fontSize="30px"
        height="30px" />
      <svg-icon
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        [ngClass]="{
          'opacity-[1] transition-all duration-1000 ease-out': isDarkMode,
          'translate-y-[20%] rotate-[100deg] opacity-0 transition-all':
            !isDarkMode
        }"
        key="light"
        fontSize="30px"
        height="30px" />
    </button>
  </ng-container>
</template>
```

En este ejemplo, comenzarás a notar algunas desviaciones significativas de la autoría tradicional en **Angular**. Para empezar, no es una clase, así que no se usa **this**. Además, verás un uso más frecuente de **const** y **let**, y los hooks del ciclo de vida se utilizan con callbacks. Más allá de estas diferencias, todo funciona sin problemas.

## 🏖️ Momento TanStack

Después de una importante refactorización, llegué a un buen punto donde todo funcionaba como se esperaba. Eso, hasta que me encontré con los Formularios. Honestamente, lo que estás a punto de leer no fue realmente un problema; más bien, proporcionó una justificación sólida para cambiar de paradigma y sirvió como una excelente excusa para experimentar con los recién lanzados **TanStack Forms**. En mi proyecto, tengo un formulario de contacto simple que permite a las personas enviarme mensajes cortos por correo electrónico. Curiosamente, Tanner Linsley (el creador de TanStack) me envió uno, jaja. Mi enfoque actual utiliza Formularios Reactivos de Angular con algunos getters para acceder a los controles más fácilmente. Sin embargo, los getters no tienen un camino directo en Analog SFC, lo que hizo de esto una oportunidad ideal para probar algo nuevo, llevándome a adoptar **TanStack Forms**. Para más detalles, consulta
la [documentación de TanStack Forms](https://tanstack.com/form/latest/docs/overview).

### Este era el enfoque anterior:

```ts
import { Component, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'mr-contact',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoDirective],
  host: { class: 'w-full' },
  template: `<ng-container *transloco="let t; read: 'contact'">
    <div class="flex flex-auto flex-col items-center gap-3 pt-20">
      <div
        class="flex w-full flex-col justify-start gap-4 align-baseline md:max-w-md">
        <h1
          class=" before:bg-primary after:bg-primary relative mb-5 w-fit text-3xl font-bold
                before:absolute before:left-[98%] before:top-[70%] before:-z-10 before:h-5
                before:w-5 before:translate-y-0 before:transition-all before:duration-500 after:absolute
                after:left-[-15px] after:top-[70%] after:-z-10 after:h-5 after:w-5 after:translate-y-0 after:transition-all
                after:duration-500 hover:before:translate-y-[-20px] hover:after:translate-y-[-20px] md:text-5xl">
          {{ t('header') }}
        </h1>
        <p class=" text-lg font-bold">
          {{ t('subheader') }}
        </p>
      </div>
      <form
        [formGroup]="contactForm"
        (ngSubmit)="submitForm()"
        class="form-control flex w-full flex-col items-center gap-3 md:max-w-md">
        <div class="w-full">
          <label class="label">
            <span class="label-text font-extrabold">{{ t('name') }}</span>
          </label>
          <input
            type="text"
            placeholder="{{ t('type-here') }}"
            formControlName="name"
            type="text"
            class="input input-bordered w-full" />
          @if (name?.errors && name?.touched) {
            <label class="label">
              <span class="label-text-alt text-error font-bold">{{
                t('name-error')
              }}</span>
            </label>
          }
        </div>
        <div class="w-full">
          <label class="label">
            <span class="label-text font-extrabold">{{ t('email') }}</span>
          </label>
          <input
            type="text"
            placeholder="{{ t('email-placeholder') }}"
            formControlName="email"
            type="email"
            class="input input-bordered w-full" />
          @if (email?.errors && email?.touched) {
            <label class="label">
              @if (email?.errors?.['required']) {
                <span class="label-text-alt text-error font-bold">{{
                  t('email-error-one')
                }}</span>
              }
              @if (email?.errors?.['email']) {
                <span class="label-text-alt text-error font-bold">{{
                  t('email-error-two')
                }}</span>
              }
            </label>
          }
        </div>
        <div class="w-full">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-extrabold">{{ t('message') }}</span>
            </label>
            <textarea
              class="textarea textarea-bordered h-24 text-base"
              formControlName="message"
              placeholder="{{ t('say-hi') }}"></textarea>
            @if (message?.errors && message?.touched) {
              <label class="label">
                <span class="label-text-alt text-error font-bold">{{
                  t('message-error')
                }}</span>
              </label>
            }
          </div>
        </div>
        <div class="mt-2 flex w-full justify-center gap-4">
          <button
            class="btn btn-outline btn-info relative w-1/3"
            [disabled]="contactForm.invalid"
            [class.spinner-loading]="loading()"
            type="submit">
            {{ t('send') }}
          </button>
          <button
            class="btn btn-outline btn-secondary w-1/3"
            type="reset"
            (click)="contactForm.reset()">
            {{ t('clear') }}
          </button>
        </div>
      </form>
    </div></ng-container
  > `,
})
export class ContactFormComponent {
  #http = inject(HttpClient);
  #toast = inject(HotToastService);
  loading = signal(false);
  readonly #environment = environment;
  contactForm = inject(FormBuilder).group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    },
    { updateOn: 'blur' }
  );

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }

  submitForm() {
    this.loading.set(true);
    this.contactForm.disable();
    const { name, email, message } = this.contactForm.value;
    this.#http
      .post(`${this.#environment.apiUrl}/send-email`, {
        name,
        email,
        message,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.#toast.success('Email sent successfully', {
            duration: 3500,
            position: 'bottom-center',
          });
          this.contactForm.enable();
          this.contactForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.#toast.error(
            `Error ${error.status} sending email: ${error.statusText}`,
            {
              duration: 3500,
              position: 'bottom-center',
            }
          );
          this.contactForm.enable();
        },
      });
  }
}
```

### Y así se ve ahora usando TanStack Forms

```html
<!--suppress ALL -->
<script lang="ts">
  import { inject } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { HotToastService } from '@ngneat/hot-toast';
  import { ReactiveFormsModule } from '@angular/forms';
  import { TranslocoDirective } from '@ngneat/transloco';
  import { FieldValidateFn, injectForm, injectStore, TanStackField } from '@tanstack/angular-form';
  import { environment } from '../../environments/environment';

  defineMetadata({
    imports: [ReactiveFormsModule, TranslocoDirective, TanStackField],
    host: { class: 'w-full' },
  });

  const http = inject(HttpClient);
  const toast = inject(HotToastService);
  const contactForm = injectForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
    onSubmit({ value }) {
      const { email, name, message } = value;
      http
        .post(`${environment.apiUrl}/send-email`, {
          name,
          email,
          message,
        })
        .subscribe({
          next: () => {
            toast.success('Email sent successfully', {
              duration: 3500,
              position: 'bottom-center',
            });
            contactForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            toast.error(
              `Error ${error.status} sending email: ${error.statusText}`,
              {
                duration: 3500,
                position: 'bottom-center',
              },
            );
          },
        });
    },
  });

  const nameValidator: FieldValidateFn<any, any, any, any, string> = ({
                                                                        value,
                                                                      }) =>
    !value
      ? 'A name is required'
      : undefined;

  const emailValidator: FieldValidateFn<any, any, any, any, string> = ({
                                                                         value,
                                                                       }) =>
    !value ?
      'An email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : undefined

  ;

  const messageValidator: FieldValidateFn<any, any, any, any, string> = ({
                                                                           value,
                                                                         }) =>
    !value
      ? 'A message is required'
      : undefined;

  const canSubmit = injectStore(contactForm, (state) => state.canSubmit);
  const isSubmitting = injectStore(contactForm, (state) => state.isSubmitting);

  function submitForm(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
    void contactForm.handleSubmit();
  }
</script>

<template>
  <ng-container *transloco="let t; read: 'contact'">
    <div class="flex flex-auto flex-col items-center gap-3 pt-20">
      <div
        class="flex w-full flex-col justify-start gap-4 align-baseline md:max-w-md">
        <h1
          class=" before:bg-primary after:bg-primary relative mb-5 w-fit text-3xl font-bold
                before:absolute before:left-[98%] before:top-[70%] before:-z-10 before:h-5
                before:w-5 before:translate-y-0 before:transition-all before:duration-500 after:absolute
                after:left-[-15px] after:top-[70%] after:-z-10 after:h-5 after:w-5 after:translate-y-0 after:transition-all
                after:duration-500 hover:before:translate-y-[-20px] hover:after:translate-y-[-20px] md:text-5xl">
          {{ t('header') }}
        </h1>
        <p class=" text-lg font-bold">
          {{ t('subheader') }}
        </p>
      </div>
      <form
        (submit)="submitForm($event)"
        class="form-control flex w-full flex-col items-center gap-3 md:max-w-md">
        <div class="w-full">
          <div class="form-control">
            <ng-container
              #name="field"
              [tanstackField]="contactForm"
              [validators]="{ onBlur:nameValidator }"
              name="name"
            >
              <label [for]="name.api.name" class="label">
                <span class="label-text font-extrabold">{{ t('name') }}</span>
              </label>
              <input
                (blur)="name.api.handleBlur()"
                (input)="name.api.handleChange($any($event).target.value)"
                [id]="name.api.name"
                [name]="name.api.name"
                [value]="name.api.state.value"
                class="input input-bordered w-full"
                placeholder="{{ t('type-here') }}"
                type="text"
              />
              @if (name.api.state.meta.touchedErrors.length > 0) {
              <label class="label">
              <span class="label-text-alt text-error font-bold">{{
                  t('name-error')
                }}</span>
              </label>
              }
            </ng-container>
          </div>
        </div>
        <div class="w-full">
          <div class="form-control">
            <ng-container
              #email="field"
              [tanstackField]="contactForm"
              [validators]="{onBlur:emailValidator}"
              name="email"
            >
              <label [for]="email.api.name" class="label">
                <span class="label-text font-extrabold">{{ t('email') }}</span>
              </label>
              <input
                (blur)="email.api.handleBlur()"
                (input)="email.api.handleChange($any($event).target.value)"
                [id]="email.api.name"
                [name]="email.api.name"
                [value]="email.api.state.value"
                class="input input-bordered w-full"
                placeholder="{{ t('email-placeholder') }}"
                type="email"
              />
              @if (email.api.state.meta.errors.length > 0) {
              @if (email.api.state.meta.errors[0].includes('required')) {
              <label class="label">
              <span class="label-text-alt text-error font-bold">{{
                  t('email-error-one')
                }}</span>
              </label>
              } @else {
              <label class="label">
              <span class="label-text-alt text-error font-bold">{{
                  t('email-error-two')
                }}</span>
              </label>
              }
              }
            </ng-container>
          </div>
        </div>
        <div class="w-full">
          <div class="form-control">
            <ng-container
              #message="field"
              [tanstackField]="contactForm"
              [validators]="{onBlur:messageValidator}"
              name="message"
            >
              <label [for]="message.api.name" class="label">
                <span class="label-text font-extrabold">{{ t('message') }}</span>
              </label>
              <textarea
                (blur)="message.api.handleBlur()"
                (input)="message.api.handleChange($any($event).target.value)"
                [id]="message.api.name"
                [name]="message.api.name"
                [value]="message.api.state.value"
                class="textarea textarea-bordered h-24 text-base"
                placeholder="{{ t('say-hi') }}"></textarea>
              @if (message.api.state.meta.touchedErrors.length > 0) {
              <label class="label">
              <span class="label-text-alt text-error font-bold">{{
                  t('message-error')
                }}</span>
              </label>
              }
            </ng-container>
          </div>
        </div>
        <div class="mt-2 flex w-full justify-center gap-4">
          <button
            [class.spinner-loading]="isSubmitting()"
            [disabled]="!canSubmit() || isSubmitting()"
            class="btn btn-outline btn-info relative w-1/3"
            type="submit">
            {{ t('send') }}
          </button>
          <button
            (click)="contactForm.reset()"
            class="btn btn-outline btn-secondary w-1/3"
            type="reset">
            {{ t('clear') }}
          </button>
        </div>
      </form>
    </div>
  </ng-container
  >
</template>
```

Lo primero que notarás es que el componente se ha vuelto bastante grande (soy consciente). Obviamente, al usar esto por primera vez, mi objetivo principal no era la optimización, sino más bien un enfoque simple de 'usarlo tal cual y hacer que funcione'. Siguiendo esto, tuiteé sobre mi experiencia y mis pensamientos sobre este enfoque. [Corbin Crutchley](https://twitter.com/crutchcorn) tuvo la amabilidad de explicar que la idea de tener muchas cosas en un solo lugar es que se supone que debes abstraer el código en un FormFieldComponent real, lo cual será más fácil de manejar.
<p style="display:flex; flex-direction:column; justify-content:center; align-items:center">
<img src="https://res.cloudinary.com/lhcc0134/image/upload/v1712238617/twitt-tanstack.png" 
        alt="Respuesta de Corbin Crutchley sobre el enfoque de TanStack Forms" />
</p>

La segunda cosa que notarás es que todo parece más simple una vez que comprendes los conceptos subyacentes. Si sientes la necesidad de profundizar, te recomiendo encarecidamente que leas su documentación. Sin embargo, haré todo lo posible por explicar lo que está sucediendo aquí:

Primero, creas tu objeto de formulario usando **injectForm**:

```ts
const contactForm = injectForm({
  defaultValues: {
    name: '',
    email: '',
    message: '',
  },
  onSubmit({ value }) {
    const { email, name, message } = value;
    http
      .post(`${environment.apiUrl}/send-email`, {
        name,
        email,
        message,
      })
      .subscribe({
        next: () => {
          toast.success('Email sent successfully', {
            duration: 3500,
            position: 'bottom-center',
          });
          contactForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          toast.error(
            `Error ${error.status} sending email: ${error.statusText}`,
            {
              duration: 3500,
              position: 'bottom-center',
            },
          );
        },
      });
  },
});
```

Puede que hayas notado que estoy agregando algunas funcionalidades en **onSubmit**, lo cual envía el correo electrónico y maneja escenarios de errores o éxito. Aquí, la clave es la simplicidad; no hay formBuilders ni formControls involucrados. Es bastante sencillo: creas los elementos de tu formulario y el manejador para el envío.

Luego, tenemos tres elementos que quizás no se expliquen por sí mismos de inmediato, así que vamos a explicar brevemente lo que hacen:

```ts
const nameValidator: FieldValidateFn<any, any, any, any, string> = ({
                                                                      value,
                                                                    }) =>
  !value
    ? 'A name is required'
    : undefined;
```

Estas son funciones de validación. Como puedes ver, creamos una y devolvemos los resultados de la validación. Pueden ser sincrónicas o asincrónicas; en este caso, he optado por sincrónicas.

Y finalmente, llegamos a la parte donde manejamos el envío del formulario, y declaramos algunas utilidades prácticas para nuestra UX.

```ts
const canSubmit = injectStore(contactForm, (state) => state.canSubmit);
const isSubmitting = injectStore(contactForm, (state) => state.isSubmitting);

function submitForm(event: SubmitEvent) {
  event.preventDefault();
  event.stopPropagation();
  void contactForm.handleSubmit();
}
```

Creo que los nombres de las variables y funciones explican en gran medida su propósito, pero profundicemos un poco más. Aquí, declaramos dos constantes que son señales, calculadas a partir del estado de nuestro formulario. Esto es particularmente útil ya que nos ayuda a gestionar el estado de la UI, permitiéndonos responder adecuadamente a los eventos de los usuarios.

Y finalmente la integración en el template, incluiré solo uno ya que los demás son prácticamente iguales:

```html

<form
  (submit)="submitForm($event)">
  <ng-container
    #name="field"
    [tanstackField]="contactForm"
    [validators]="{ onBlur:nameValidator }"
    name="name"
  >
    <label [for]="name.api.name" class="label">
      <span class="label-text font-extrabold">{{ t('name') }}</span>
    </label>
    <input
      (blur)="name.api.handleBlur()"
      (input)="name.api.handleChange($any($event).target.value)"
      [id]="name.api.name"
      [name]="name.api.name"
      [value]="name.api.state.value"
      class="input input-bordered w-full"
      placeholder="{{ t('type-here') }}"
      type="text"
    />
    @if (name.api.state.meta.touchedErrors.length > 0) {
    <label class="label">
              <span class="label-text-alt text-error font-bold">{{
                  t('name-error')
                }}</span>
    </label>
    }
  </ng-container>
</form>
<div class="mt-2 flex w-full justify-center gap-4">
  <button
    [class.spinner-loading]="isSubmitting()"
    [disabled]="!canSubmit() || isSubmitting()"
    class="btn btn-outline btn-info relative w-1/3"
    type="submit">
    {{ t('send') }}
  </button>
  <button
    (click)="contactForm.reset()"
    class="btn btn-outline btn-secondary w-1/3"
    type="reset">
    {{ t('clear') }}
  </button>
</div>
```

En esta sección, integramos todo en el template. La directiva **tanstackField** hace su magia, manejando la validación del formulario **onBlur**. Además, puedes observar cómo las utilidades que declaramos afectan el estado de nuestros botones. Si el formulario no está listo para ser enviado, el botón se desactivará, y si el formulario está en proceso de "envío", el botón mostrará una elegante animación de carga.

## 🌟 Conclusión: El Camino Adelante con Analog

Sumergirse en el nuevo Analog SFC fue pan comido, incluso con un par de obstáculos en el camino. Es increíble ver cuánto ha crecido, especialmente ahora que la versión 1.0 ha salido a la luz y más personas se están sumando para contribuir. Estar en el equipo principal y ayudar a llevar esta visión a la realidad es algo de lo que estoy realmente orgulloso. Además, Angular 17 está revolucionando las cosas con herramientas impresionantes como TanStack Query y TanStack Forms abriéndose camino en Angular. Honestamente, no hay mejor momento para adentrarse en Angular y todas las cosas geniales que lo rodean. Estoy totalmente comprometido y disfrutando cada momento de este viaje.

---

Si encontraste este artículo interesante, no dudes en conectarte conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). ¡Embarquémonos juntos en este viaje de descubrimiento e innovación! 💻🚀📘

¿Te sientes generoso? Muestra algo de amor y [cómprame un café](https://www.buymeacoffee.com/luishcastrv). ¡Tu apoyo es muy apreciado! ☕️


