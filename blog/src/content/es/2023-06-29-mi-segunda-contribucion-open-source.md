---
title: Mi Segunda Contribución Open Source, AnalogJS
slug: mi-segunda-contribucion-open-source
otherSlug: my-second-open-source-contribution
description: Aventurandome en el reino de las contribuciones a código abierto.
author: Luis Castro
coverImage: v1691372382/oss-cover.webp
date: 06-29-2023
---

Aventurarse en el ámbito de las contribuciones de código abierto puede resultar desalentador, especialmente para los recién llegados. Esta es la historia de mi viaje inaugural a este apasionante mundo, en el que pretendía contribuir a [AnalogJS](https://analogjs.org), un meta-framework de Angular.

## Encontrando un Buen Primer Problema

En general, un buen punto de partida es explorar la pestaña de _problemas_ (o _issues_ en inglés) del proyecto que te interesa. A menudo, los encargados marcan algunos problemas con etiquetas como "buen primer problema" o "good first issue", aliviando el miedo de sumergirse de lleno en las partes más complicadas del proyecto. Sin embargo, en esta ocasión, no pude encontrar dicha etiqueta, así que decidí tomar la iniciativa y abordar un problema relacionado con la eliminación de algunos mensajes de obsolescencia.

Antes de continuar, conozcamos un poco más sobre AnalogJS.

## AnalogJS: Una Breve Descripción

AnalogJS, según se define en la documentación del proyecto, es un meta-framework "fullstack" para construir aplicaciones y sitios web con Angular. Trazando paralelismos con otros meta-frameworks como Next.JS, Nuxt, SvelteKit, Qwik City y otros, Analog ofrece una experiencia similar, pero con un toque Angular.

Aquí hay algunas características que hacen que AnalogJS se destaque:

- Soporta Vite/Vitest/Playwright
- Enrutamiento basado en archivos
- Soporte para usar markdown como rutas de contenido
- Soporte para rutas API/servidor
- Soporte híbrido SSR/SSG
- Soporta espacios de trabajo de Angular CLI/Nx
- Soporta componentes Angular con Astro

Dicho esto, volvamos al problema de obsolescencia que tenemos entre manos.

## Los Mensajes de Obsolescencia

Los mensajes de obsolescencia que intenté corregir fueron:

```shell
marked(): highlight and langPrefix parameters are deprecated since version 5.0.0, should not be used and will be removed in the future. Instead use https://www.npmjs.com/package/marked-highlight.

marked(): mangle parameter is enabled by default, but is deprecated since version 5.0.0, and will be removed in the future. To clear this warning, install https://www.npmjs.com/package/marked-mangle, or disable by setting `{mangle: false}`.

marked(): headerIds and headerPrefix parameters enabled by default, but are deprecated since version 5.0.0, and will be removed in the future. To clear this warning, install  https://www.npmjs.com/package/marked-gfm-heading-id, or disable by setting `{headerIds: false}`.
```

Los encargados habían dado pistas útiles sobre el código que necesitaba ser alterado, localizado en `packages/content/src/lib/markdown-content-renderer.service.ts`.

## Sumergiéndome en el Código

Para evitar causar estragos en el código original, comencé haciendo un "fork" del repositorio, lo que me permitiría trabajar en mi propia copia. Luego, me dirigí al servicio mencionado anteriormente, que lucía algo así:

```ts
/**
 * Credit goes to Scully for original implementation
 * https://github.com/scullyio/scully/blob/main/libs/scully/src/lib/fileHanderPlugins/markdown.ts
 */
import { inject, Injectable, PLATFORM_ID, Provider } from '@angular/core';
import { marked } from 'marked';

import 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';

import { ContentRenderer } from './content-renderer';

declare const Prism: typeof import('prismjs');

const renderer = new marked.Renderer();
// wrap code block the way Prism.js expects it
renderer.code = function (this: any, code, lang) {
  // eslint-disable-next-line
  code = this.options.highlight(code, lang);
  if (!lang) {
    return '<pre><code>' + code + '</code></pre>';
  }
  // e.g. "language-js"
  const langClass = 'language-' + lang;
  return (
    '<pre class="' +
    langClass +
    '"><code class="' +
    langClass +
    '">' +
    code +
    '</code></pre>'
  );
};
// ------------------------------

@Injectable()
export class MarkdownContentRendererService implements ContentRenderer {
  platformId = inject(PLATFORM_ID);

  async render(content: string) {
    marked.setOptions({
      renderer,
      highlight: (code, lang) => {
        lang = lang || 'typescript';
        if (!Prism.languages[lang]) {
          console.warn(`Notice:
    ---------------------------------------------------------------------------------------
      The requested language '${lang}' is not available with the provided setup.
      To enable, import your main.ts as:
        import  'prismjs/components/prism-${lang}';
    ---------------------------------------------------------------------------------------
          `);
          return code;
        }
        return Prism.highlight(code, Prism.languages[lang], lang);
      },
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartypants: false,
      xhtml: false,
    });

    return marked(content);
  }

  // eslint-disable-next-line
  enhance() {}
}

export function withMarkdownRenderer(): Provider {
  return { provide: ContentRenderer, useClass: MarkdownContentRendererService };
}

export function provideContent(...features: Provider[]) {
  return [...features];
}
```

Armado con la ubicación del código y los mensajes de obsolescencia como mi guía, comencé a investigar la [documentación de la biblioteca marked](https://marked.js.org). Los mensajes de obsolescencia proporcionaron una ruta sobre los cambios necesarios para resolver el problema.

Me di cuenta de que necesitaba reemplazar los parámetros obsoletos con las alternativas recomendadas. Esto incluía reemplazar los parámetros `highlight` y `langPrefix` con un nuevo paquete `marked-highlight`, ajustar el parámetro `mangle` ya sea instalando el paquete `marked-mangle` o estableciendo `{mangle: false}`, y finalmente, manejando los parámetros `headerIds` y `headerPrefix` ya sea integrando el paquete `marked-gfm-heading-id` o estableciendo `{headerIds: false}`.

Habiendo comprendido los cambios requeridos de la documentación, pasé al siguiente paso: modificar el código en mi repositorio (fork).

Uno de ellos fue realmente sencillo ya que era una funcionalidad que realmente no se utilizaba en la implementación:

```shell
marked(): mangle parameter is enabled by default, but is deprecated since version 5.0.0, and will be removed in the future. To clear this warning, install https://www.npmjs.com/package/marked-mangle, or disable by setting `{mangle: false}`.
```

Este mensaje se resolvió simplemente añadiendo el indicador adecuado como falso (como se indicaba en el propio mensaje).

```ts
async render(content: string) {
    marked.setOptions({
      renderer,
      highlight: (code, lang) => {
        lang = lang || 'typescript';
        if (!Prism.languages[lang]) {
          console.warn(`Notice:
    ---------------------------------------------------------------------------------------
      The requested language '${lang}' is not available with the provided setup.
      To enable, import your main.ts as:
        import  'prismjs/components/prism-${lang}';
    ---------------------------------------------------------------------------------------
          `);
          return code;
        }
        return Prism.highlight(code, Prism.languages[lang], lang);
      },
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartypants: false,
      xhtml: false,
      mangled: false,
    });

    return marked(content);
  }

  // eslint-disable-next-line
  enhance() {}
}

```

¡Pan comido! Ahora, con la emoción de poder arreglar cosas, pensé que el siguiente sería tan fácil como este, y mi próxima contribución a este proyecto era inminente. Pero estaba equivocado.

Los siguientes dos mensajes eran sobre cosas que realmente formaban parte de la implementación:

## IDs de Encabezados GFM

Un ID de encabezado GFM (Markdown con Sabor a GitHub) es el identificador que GitHub asigna automáticamente a cada encabezado en un archivo markdown. Te permite enlazar directamente a una sección específica dentro de un documento.

## Resaltado de Sintaxis de Código

El resaltado de sintaxis de código en Markdown es una característica ofrecida por muchos editores de texto, visores de markdown y sitios web como GitHub. Mejora la legibilidad de los fragmentos de código incrustados en documentos markdown aplicando diferenciación de color y estilo. Cuando encierras el código dentro de los bloques de código de markdown (usando acentos graves) y especificas el lenguaje, el sistema reconoce la sintaxis de ese lenguaje en particular y aplica una codificación de colores apropiada. Esto hace que elementos como palabras clave, variables, cadenas o comentarios en el código sean fácilmente distinguibles, ayudando a comprender la estructura y lógica del fragmento de código. Esto se vuelve particularmente valioso al compartir código, discutir soluciones o documentar el comportamiento del código dentro de archivos markdown.

Con esa información y basándome en la documentación y el mensaje, se necesitaban 2 nuevos paquetes que reemplazaran esa funcionalidad.

**marked-gfm-heading-id** y **marked-highlight**

Así que, procedí a añadirlos al repositorio usando:

```shell
pnpm add marked-highlight marked-gfm-heading-id -w
```

Después de agregar las dependencias, procedí a utilizarlas como recomendaba la documentación y terminé con algo así:

```ts
/**
 * Credit goes to Scully for original implementation
 * https://github.com/scullyio/scully/blob/main/libs/scully/src/lib/fileHanderPlugins/markdown.ts
 */
import { inject, Injectable, PLATFORM_ID, Provider } from '@angular/core';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';

import 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';

import { ContentRenderer } from './content-renderer';

declare const Prism: typeof import('prismjs');

const renderer = new marked.Renderer();
// wrap code block the way Prism.js expects it
renderer.code = function (code, lang) {
  if (!lang) {
    return '<pre><code>' + code + '</code></pre>';
  }
  // e.g. "language-js"
  const langClass = 'language-' + lang;
  return (
    '<pre class="' +
    langClass +
    '"><code class="' +
    langClass +
    '">' +
    code +
    '</code></pre>'
  );
};
// ------------------------------

@Injectable()
export class MarkdownContentRendererService implements ContentRenderer {
  platformId = inject(PLATFORM_ID);

  async render(content: string) {
    marked.use(
      gfmHeadingId(),
      markedHighlight({
        highlight: (code, lang) => {
          lang = lang || 'typescript';
          if (!Prism.languages[lang]) {
            console.warn(`Notice:
  ---------------------------------------------------------------------------------------
    The requested language '${lang}' is not available with the provided setup.
    To enable, import your main.ts as:
      import  'prismjs/components/prism-${lang}';
  ---------------------------------------------------------------------------------------
        `);
            return code;
          }
          return Prism.highlight(code, Prism.languages[lang], lang);
        },
      }),
      {
        renderer,
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartypants: false,
        xhtml: false,
        mangle: false,
        headerIds: false,
      }
    );

    return marked(content);
  }

  // eslint-disable-next-line
  enhance() {}
}

export function withMarkdownRenderer(): Provider {
  return { provide: ContentRenderer, useClass: MarkdownContentRendererService };
}

export function provideContent(...features: Provider[]) {
  return [...features];
}
```

A primera vista, parecía sencillo. Reemplacé `marked.setOptions` con `marked.use` e hice los cambios necesarios para incorporar las nuevas extensiones. Además, eliminé la función de resaltado del renderizador, ya que también estaba obsoleta. Al final, el único proceso que necesitábamos era uno para formatear correctamente el código para **PrismJS** (la biblioteca utilizada para agregar colores) según el lenguaje proporcionado.

Todo parecía estar en orden, e incluso agregué una prueba unitaria para facilitar el proceso. Sin embargo, debido a mi limitado entendimiento del código en ese momento, no utilicé completamente las herramientas que el proyecto ya proporcionaba para las pruebas. Después de un PR inicial, el mantenedor principal del proyecto, [Brandon Roberts](https://github.com/brandonroberts), me informó que no estaba funcionando correctamente y que había una aplicación real dentro del proyecto para pruebas más exhaustivas (en conjunto con las pruebas unitarias).

Al examinar la aplicación y notar que la función de resaltado no funcionaba correctamente y requería una actualización de página para mostrar el código con el formato correcto, comencé a investigar problemas potenciales.

El primer problema que encontré fue que después de cierto tiempo de hacer clic en los enlaces de la aplicación, simplemente se congelaban, provocando que Chrome se bloqueara. Claramente, este problema no existía antes, por lo que era muy probable que estuviera relacionado con mi implementación y la supuesta "solución".

Después de numerosos intentos de solucionar el problema, búsquedas en línea, e incluso consultas con ChatGPT, decidí comenzar una discusión en el GitHub de Marked ([enlace](https://github.com/markedjs/marked/discussions/2861) si estás interesado). Recibí una respuesta rápida de uno de los mantenedores, quien me dirigió hacia lo que parecía ser la solución adecuada en ese momento.

Parecía que cada llamada a `marked.use` creaba una nueva instancia de la extensión, lo que podría causar problemas significativos dependiendo del uso. Después de investigar cómo se abordó el problema, llegué a esta solución (créditos a icebaker por la [solución original](https://github.com/markedjs/marked-highlight/issues/26#issuecomment-1570188027)).

```ts
/**
 * Generating a unique instance of Marked to avoid re-generation after each "use"
 * Until the new marked types are released this was the best solution to avoid regenerating marked
 * */
const Marked = {
  instantiated: false,

  setup: () => {
    const renderer = new marked.Renderer();
    // wrap code block the way Prism.js expects it
    renderer.code = (code, lang) => {
      if (!lang) {
        return '<pre><code>' + code + '</code></pre>';
      }
      // e.g. "language-js"
      const langClass = 'language-' + lang;
      const html =
        '<pre class="' +
        langClass +
        '"><code class="' +
        langClass +
        '">' +
        code +
        '</code></pre>';
      return html;
    };
    // ------------------------------

    marked.use(
      gfmHeadingId(),
      markedHighlight({
        highlight: (code, lang) => {
          lang = lang || 'typescript';
          if (!Prism.languages[lang]) {
            console.warn(`Notice:
    ---------------------------------------------------------------------------------------
    The requested language '${lang}' is not available with the provided setup.
    To enable, import your main.ts as:
      import  'prismjs/components/prism-${lang}';
    ---------------------------------------------------------------------------------------
        `);
            return code;
          }
          return Prism.highlight(code, Prism.languages[lang], lang);
        },
      }),
      {
        renderer,
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartypants: false,
        xhtml: false,
        mangle: false,
      }
    );

    Marked.instantiated = true;
  },

  instance: () => {
    if (!Marked.instantiated) Marked.setup();

    return marked;
  },
};

@Injectable()
export class MarkdownContentRendererService implements ContentRenderer {
  platformId = inject(PLATFORM_ID);

  async render(content: string) {
    return Marked.instance().parse(content);
  }

  // eslint-disable-next-line
  enhance() {}
}
```

¿Simple, verdad?, La explicación rápida para este enfoque es que, ahora, si el proceso requiere otra instancia de `marked.use`, la variable `Marked.instantiated` indica que ya hay una instancia disponible y proporcionará esa.

Sin embargo, como Brandon señaló durante la revisión del PR, este método no está en línea con las prácticas de Angular. Sugirió crear un servicio Angular que pudiera aprovechar al máximo los beneficios de la [Inyección de Dependencias](https://angular.io/guide/dependency-injection) de Angular. Después de implementar algunos cambios, llegamos a la solución final:

Creé un servicio llamado `marked-setup.service.ts` para gestionar la configuración de Marked y PrismJS. Así es como se ve:

```ts
/**
 * Credit goes to Scully for original implementation
 * https://github.com/scullyio/scully/blob/main/libs/scully/src/lib/fileHanderPlugins/markdown.ts
 */
import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';

import 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';

declare const Prism: typeof import('prismjs');

@Injectable()
export class MarkedSetupService {
  private readonly marked: typeof marked;

  constructor() {
    const renderer = new marked.Renderer();
    renderer.code = (code, lang) => {
      if (!lang) {
        return '<pre><code>' + code + '</code></pre>';
      }
      const langClass = 'language-' + lang;
      const html =
        '<pre class="' +
        langClass +
        '"><code class="' +
        langClass +
        '">' +
        code +
        '</code></pre>';
      return html;
    };

    marked.use(
      gfmHeadingId(),
      markedHighlight({
        highlight: (code, lang) => {
          lang = lang || 'typescript';
          if (!Prism.languages[lang]) {
            console.warn(`Notice:
    ---------------------------------------------------------------------------------------
    The requested language '${lang}' is not available with the provided setup.
    To enable, import your main.ts as:
      import  'prismjs/components/prism-${lang}';
    ---------------------------------------------------------------------------------------
        `);
            return code;
          }
          return Prism.highlight(code, Prism.languages[lang], lang);
        },
      }),
      {
        renderer,
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartypants: false,
        xhtml: false,
        mangle: false,
      }
    );

    this.marked = marked;
  }

  getMarkedInstance(): typeof marked {
    return this.marked;
  }
}
```

Para simplificarlo, generamos una instancia de la biblioteca marked dentro del constructor. Esta instancia está equipada con todas las extensiones y opciones necesarias para ofrecer la misma funcionalidad que tenía anteriormente. Luego, se puede acceder a esta instancia a través del método getMarkedInstance().

El viaje no termina ahí. Ahora, el servicio necesitaba ser consumido dentro de otro servicio. Después de algunas refactorizaciones, terminamos con la siguiente implementación:

```ts
import { inject, Injectable, PLATFORM_ID, Provider } from '@angular/core';

import { ContentRenderer } from './content-renderer';
import { MarkedSetupService } from './marked-setup.service';

@Injectable()
export class MarkdownContentRendererService implements ContentRenderer {
  platformId = inject(PLATFORM_ID);
  #marked = inject(MarkedSetupService, { self: true });

  async render(content: string) {
    return this.#marked.getMarkedInstance().parse(content);
  }

  // eslint-disable-next-line
  enhance() {}
}

export function withMarkdownRenderer(): Provider {
  return {
    provide: ContentRenderer,
    useClass: MarkdownContentRendererService,
    deps: [MarkedSetupService],
  };
}

export function provideContent(...features: Provider[]) {
  return [...features, MarkedSetupService];
}
```

Un detalle crucial para recordar es que empleamos `inject(MarkedSetupService)` para incorporar la dependencia en el servicio que la consume. Puedes ignorar la parte `{ self: true }`, ya que no tiene un papel en este contexto y es probablemente un error de tipografía. La operación principal ocurre aquí:

```ts
export function provideContent(...features: Provider[]) {
  return [...features, MarkedSetupService];
}
```

En esta sección, instruimos a Angular para que proporcione una instancia de MarkedSetupService. Si un servicio es suministrado en otro servicio, Angular generará una nueva instancia del servicio proporcionado para cada nueva instancia del servicio consumidor. Si el servicio consumidor es un singleton, el servicio proporcionado también será un singleton.

Al volver a ejecutar las pruebas unitarias y reenviar el PR, la respuesta fue favorable, y el PR se fusionó exitosamente.

¡Gracias por leer! Espero que este recorrido haya sido informativo y agradable.
