---
title: Hablemos de NG
slug: hablemos-de-ng
otherSlug: lets-talk-about-ng
description: Descubre una nueva forma de escribir componentes en Angular, usando la característica de creación de componentes NG en AnalogJs.
author: Luis Castro
coverImage: v1705169936/analog-ng.png
date: 01-13-2024
---

## Controversia y Angular

Controversia es un término que se refiere a situaciones con fuertes desacuerdos u opiniones conflictivas. En tecnología, estas controversias a menudo surgen cuando un Framework popular (o impopular) como Angular experimenta cambios o se enfrenta a desafíos. Hoy, nos adentramos en uno de esos aspectos de Angular que está despertando interés y debate: la creación de componentes NG.

Un día estás relajado y navegando por twitter y encuentras esto:

<p style="display:flex; flex-direction:column; justify-content:center; align-items:center">
<img src="https://res.cloudinary.com/lhcc0134/image/upload/v1705170492/ng-first-idea.png" width="500px" height="auto"
        alt="Primer acercamiento a NG" />
</p>

Pero luego, después de un tiempo, encuentras esto:

<p style="display:flex; flex-direction:column; justify-content:center; align-items:center;">
<img src="https://res.cloudinary.com/lhcc0134/image/upload/v1705170492/ng-official.png" width="500px" height="auto"
        alt="NG Anuncio oficial" />
</p>

## Áreas específicas de controversia en Angular

- **Curva de aprendizaje**: La arquitectura de Angular es más compleja y tiene una curva de aprendizaje más pronunciada en comparación con otros frameworks, como React. Esta complejidad puede ser frustrante para los principiantes, lo que lleva a críticas de aquellos que prefieren opciones más simples. El equipo de Angular está trabajando activamente para mejorar esto, centrándose en el renacimiento de Angular.

- **Opiniones del framework**: El enfoque de Angular para estructurar y organizar el código es más "opinativo". Si bien esto conduce a una mayor consistencia y mantenibilidad, puede sentirse restrictivo para los desarrolladores que prefieren más libertad y flexibilidad.

- **Competencia**: El panorama de frameworks de JavaScript está en constante evolución, con opciones más nuevas como React y Vue.js ganando popularidad. Esto lleva a comparaciones y debates sobre qué framework es "mejor", a veces arrojando una luz negativa sobre Angular.

Pero no estamos aquí para iniciar un debate; estamos aquí para hablar de algo que podría cambiar la forma en que escribes tus componentes Angular.

## Analog Js, aquí vamos de nuevo

Si has leído mis publicaciones en el blog (no tengo muchas), sabes que soy un gran fanático de Angular y contribuyo a un meta-framework llamado [AnalogJs](https://analogjs.org/). AnalogJs es un meta-framework full-stack diseñado para mejorar la experiencia de Angular para la construcción de aplicaciones y sitios web. Junto con otros meta-frameworks, Analog lleva Angular a un nivel diferente, incluidas funciones como:

- **Soporte Vite/Vitest/Playwright**: Analog se integra perfectamente con herramientas de desarrollo modernas como Vite, Vitest y Playwright, lo que garantiza un flujo de trabajo fluido.

- **Enrutamiento basado en archivos**: Analog simplifica el enrutamiento con un sistema basado en archivos, lo que permite una estructura de navegación más intuitiva.

- **Markdown como rutas de contenido**: Analog permite el uso de archivos markdown como rutas de contenido, lo que agiliza la gestión de contenido.

- **Soporte de rutas API/Servidor**: Analog admite rutas API y de servidor, mejorando la versatilidad del framework para las necesidades del backend.

- **Soporte híbrido SSR/SSG**: Analog proporciona soporte híbrido para Server-Side Rendering (SSR) y Static Site Generation (SSG), atendiendo a diversas necesidades de implementación.

- **Compatibilidad con Angular CLI/Nx Workspace**: Totalmente compatible con Angular CLI y Nx workspaces, Analog se integra sin esfuerzo en los ecosistemas Angular existentes.

- **Soporte para componentes Angular con Astro**: Analog adopta la última tecnología web, admitiendo componentes Angular dentro de Astro, ampliando las capacidades del framework.

Sin embargo, su creador y mantenedor, [Brandon Roberts](https://twitter.com/brandontroberts), junto con otro superinteligente GDE, [Chau Tran](https://twitter.com/Nartc1410), comenzaron a trabajar en una nueva función que podría cambiar la forma en que escribes tus componentes Angular. Esta función también podría marcar un camino claro para lo que Analog podría significar para la comunidad Angular: la creación de componentes NG (no estoy seguro si ese es el término adecuado, pero me arriesgaré aquí).

## ¿Qué es la creación de componentes NG?

Primero, hablemos de cómo se escribe un componente en Angular. Tienes un componente que se ve así:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world', // El selector es el nombre del componente, este es el nombre que usarás en el HTML
  templateUrl: './hello-world.component.html', // Directorio de la plantilla si usas una externa
  template: `<h1>Hello, Angular!</h1>`, // Plantilla inline
  standalone: true, // Si es un componente independiente (standalone)
  imports: [CommonModule], // Arreglo de Imports (si es standalone)
  styleUrls: ['./hello-world.component.css'], //Archivo de estilos
})
export class HelloWorldComponent {
  message: string; // Propiedades del componente accesibles desde la plantilla

  constructor() {
    this.message = 'Hello, Angular!'; // Inicialización de la propiedad en el constructor
  }

  // Puedes agregar métodos que se ejecuten en el componente
  sayHello() {
    alert(this.message);
  }
}
```

Seguramente me estoy perdiendo algunas cosas, pero te haces una idea. En Angular, tienes una clase que tiene un decorador, que le dice a Angular cómo instanciar este componente, qué plantilla y estilos usar, qué módulos importar, etc. A diferencia de React, Vue.js o Svelte, este enfoque para la creación de componentes en Angular a menudo se percibe como el más difícil. No necesariamente porque sea inherentemente difícil, sino porque no es tan intuitivo. Necesitas aprender bastante antes de poder escribir efectivamente un componente en Angular. Y ahí es exactamente donde entra en juego la creación de componentes NG.

Enormemente inspirados por Vue y Svelte, **Brandon** y **Chau** han entregado esta funcionalidad que se ve así:

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

Extraño, ¿verdad? Sí, al principio, pero vamos a desglosarlo un poco, primero tienes una etiqueta de script que se ve así:

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

Probablemente esto te resulte familiar, ¿verdad? En Angular, tradicionalmente, trabajarías con una clase que incluye un decorador. Pero aquí es donde las cosas comienzan a diferir: entra en juego la función **defineMetadata**. Esta función sirve esencialmente para el mismo propósito que el decorador `@Component`, pero de una manera nueva. Además, los hooks de ciclo de vida han evolucionado; ahora son funciones invocables. Por ejemplo, **onInit** se transforma en una función donde pasas un callback. Cambios interesantes, ¿no? Ahora, pasemos a la parte de la plantilla:

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

Aquí es donde las cosas se ponen interesantes. La primera cosa se me viene a la mente es que estamos usando el componente Hello y AnotherOne sin ponerlos dentro del arreglo de imports (¿Qué tipo de brujería es esta?). Pero no se detiene ahí; también puedes usar componentes "viejos" de Angular (esos que necesitarás poner dentro del arreglo de imports, especialmente si estás usando componentes standalone). En segundo lugar, puedes usar el componente con el nombre del archivo (usando camelCase) o usando un selector... bastante genial, ¿verdad? Este enfoque es más familiar si vienes de bases de código de React o Vue.

Y finalmente, el tag `<Script`. Este, creo, puede ser autoexplicativo 🧐. Aquí es donde pones tus estilos para que este componente se vea hermoso...

## Como funciona esta magia? 📝

Bueno, la magia sucede usando un plugin de Vite que escanea el archivo .ng, buscando las diferentes etiquetas y transformándolo en un componente Angular regular. Entonces, Angular nunca se da cuenta de que tú, un desarrollador, estás tratando de interrumpir el status quo... Pero no me escuches a mí; soy como Jon Snow cuando se trata de estas cosas. Así que escuchémoslo de alguien que puede explicarlo un poco mejor que yo en este video de YouTube: [How to casually change the entire way Angular components work](https://www.youtube.com/watch?v=XoCtEmOvfg4).

## ¿Cómo puedo usarlo ahora mismo? 🤩

Primero, lo primero, esto es experimental, por lo que podrías quemar tu casa si lo usas en producción. Pero si eres como yo y te gusta vivir al límite, puedes comenzar instalando la última versión beta de AnalogJs. Sigue las instrucciones para generar una nueva aplicación de Analog desde [aquí](https://analogjs.org/docs/getting-started) y luego actualiza tu package.json para usar la última beta (en el momento de escribir esto es 0.2.30-beta.7). A continuación, ve a tu vite.config.ts y agrega lo siguiente.

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

> **Nota**: Puntos extra para Chau y Brandon por enfatizar lo experimental que es esto 😂

## Conclusiones

Con todos los cambios que Angular está trayendo al framework, las puertas están abiertas para que los innovadores encuentren nuevas formas de hacer las cosas. Todo comenzó con AnalogJs, pero la curiosidad y las nuevas características hicieron posible el componente NG, y estoy seguro de que hay más por venir. Entonces, si eres un desarrollador de Angular, o incluso uno de React, Vue o Svelte, prueba Analog; es posible que te sorprendas gratamente.

> **Nota**: Este no es un post patrocinado; solo soy un fanático del framework y el meta-framework, compartiendo mis pensamientos sobre esto.

---

Si encontraste este artículo interesante, no dudes en conectarte conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev) o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Embárquemonos en este viaje de descubrimiento e innovación juntos! 💻🚀📘

También puedes apoyarme comprándome un café ☕️. ¡Lo apreciaría mucho! [Buy me a coffee](https://www.buymeacoffee.com/luishcastrv)
