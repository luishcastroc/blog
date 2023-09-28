---
title: Mejorando Mi Blog AnalogJs con Transloco para Traducciones Sin Problemas
slug: mejorando-blog-analogjs-con-transloco
otherSlug: enhancing-analogjs-blog-with-transloco
description: Una guía paso a paso sobre cómo integré Transloco en mi blog AnalogJs, asegurando la accesibilidad del contenido.
author: Luis Castro
coverImage: v1692660417/transloco-integration.png
date: 09-10-2023
---

## Introducción

Siendo mexicano viviendo en los EE.UU., siempre he valorado la importancia del bilingüismo. No se trata solo de comunicación; se trata de unir culturas. Con esto en mente, decidí integrar Transloco en mi blog AnalogJs, haciendo mi contenido más accesible.

## La Visión Bilingüe para Mi Blog

Entonces, la idea es esta: Cuando primero llegas a mi blog, verificará la configuración de idioma de tu navegador. Si está configurado en español, verás el contenido en español; si es cualquier otro idioma, obtendrás inglés por defecto. Pero también quería dar control a los lectores. Ahí es donde entra el botón de la bandera. Ubicado en un lugar notorio de la página, este botón te permite alternar entre inglés (con una bandera de EE.UU.) y español (con una bandera mexicana). Con solo un clic, todo el blog cambia de idioma en tiempo real. ¿Simple, verdad? Aunque estamos comenzando con estos dos idiomas, esto sienta las bases para posiblemente agregar más en el futuro.

## Transloco: Traducciones de Contenido Sin Problemas

Transloco es una solución Angular i18n que permite definir traducciones en varios idiomas y cambiar entre ellos sin problemas. Algunas de sus funcionalidades principales incluyen:

- **Plantillas claras y sin redundancia**: Asegurando que las plantillas permanezcan concisas y no repetitivas.
- **Soporte para Lazy Load**: Carga de archivos de traducción bajo demanda para un rendimiento optimizado.
- **Plugins**: Un ecosistema diverso que atiende tanto las necesidades de desarrollo como de producción.
- **Fallbacks Múltiples**: Soporte completo para fallbacks, asegurando la disponibilidad del contenido.
- **Soporte para SSR**: Compatibilidad con Angular SSR, permitiendo traducciones pre-renderizadas.

Para una mirada más detallada a Transloco, puedes consultar la [documentación oficial de Transloco](https://ngneat.github.io/transloco/).

## Pasos de Integración

1. **Instalación**: Comencé instalando Transloco.

```shell
pnpm add @ngneat/transloco.
```

2. **Configuración**: Usando el esquema, agregué la configuración necesaria desde el generador. Es crucial establecer el SSR en verdadero para pre-renderizar las traducciones, asegurando una experiencia de usuario fluida.

```shell
pnpx nx g @ngneat/transloco:ng-add --blog
```

#### Configurando el Transloco Loader

El primer paso fue configurar el archivo `transloco-loader.ts`, que cargaría los archivos de traducción, específicamente los archivos es.json y en.json.

```ts
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  #http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.#http.get<Translation>(
      `${environment.baseUrl}/assets/i18n/${lang}.json`
    );
  }
}
```

#### Organizando Archivos de Traducción

Organicé los archivos de traducción dentro del directorio de activos, que incluía los idiomas que seleccioné durante la configuración ('en' y 'es') en forma de archivos JSON.

#### Manejando Configuraciones de Idioma del Navegador

En lugar de usar la ruta para determinar el idioma activo, utilicé el idioma del navegador para determinar el idioma activo, asegurando que incluso los slugs de las publicaciones del blog fueran traducidos. Para esto, creé un componente llamado `translate-button.component.ts``.

```ts
import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Subscription, take } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'mr-translate-button',
  standalone: true,
  imports: [NgClass, TranslocoModule],
  template: `<ng-container *transloco="let t; read: 'navigation'">
    <li class="w-16">
      <button
        class="btn btn-square btn-ghost relative h-[46px] w-full overflow-hidden"
        [attr.aria-label]="t('aria-label-translate')"
        (click)="changeLanguage()">
        <img
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          [ngClass]="{
            'translate-y-[20%] rotate-[50deg] opacity-0 transition-all':
              !toggleLang,
            'opacity-[1] transition-all duration-1000 ease-out': toggleLang
          }"
          src="assets/mexico.png"
          height="40"
          width="40" />
        <img
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          [ngClass]="{
            'opacity-[1] transition-all duration-1000 ease-out': !toggleLang,
            'translate-y-[20%] rotate-[100deg] opacity-0 transition-all':
              toggleLang
          }"
          src="assets/usa.png"
          height="40"
          width="40" />
      </button>
    </li>
  </ng-container> `,
})
export class TranslateButtonComponent {
  #transloco = inject(TranslocoService);
  availableLangs = this.#transloco.getAvailableLangs();
  toggleLang = this.#transloco.getActiveLang() === 'en' ? true : false;
  private subscription!: Subscription | null;

  get activeLang() {
    return this.#transloco.getActiveLang();
  }

  changeLanguage() {
    const lang = this.activeLang === 'en' ? 'es' : 'en';

    this.subscription?.unsubscribe();
    this.subscription = this.#transloco
      .load(lang)
      .pipe(take(1))
      .subscribe(() => {
        this.#transloco.setActiveLang(lang);
      });

    this.toggleLang = !this.toggleLang;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }
}
```

#### Organizando las Publicaciones del Blog

Para diferenciar entre publicaciones en inglés y español, organicé las publicaciones de mi blog de la siguiente manera:

```shell
├── en
│   ├── 2023-06-29-my-second-open-source-contribution.md
│   ├── 2023-07-07-module-federation.md
│   ├── 2023-08-06-the-making-of-my-web.md
│   ├── 2023-08-12-from-scratch-to-storage.md
│   ├── 2023-08-21-first-angular-contribution.md
│   ├── 2023-08-30-first-week-unemployed.md
│   └── 2023-09-10-enhancing-analogjs-blog-with-transloco.md
└── es
    ├── 2023-06-29-mi-segunda-contribucion-open-source.md
    ├── 2023-07-07-module-federation.md
    ├── 2023-08-06-como-hice-mi-blog.md
    ├── 2023-08-12-de-cero-a-almacenamiento.md
    ├── 2023-08-21-primera-contribucion-a-angular.md
    ├── 2023-08-30-primera-semana-desempleado.md
    └── 2023-09-10-mejorando-blog-analogjs-con-transloco.md
```

Este enfoque requirió más esfuerzo pero fue esencial para la compatibilidad con SSR.

#### Configurando Vite

Luego modifiqué la configuración de Vite para pre-renderizar los archivos.

```ts
/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as fs from 'fs';

const getPostRoutes = (language: string) => {
  const posts = fs.readdirSync(`./blog/src/content/${language}`);
  return posts.map(
    post =>
      `/blog/${post.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '')}`
  );
};

const postRoutes = {
  en: getPostRoutes('en'),
  es: getPostRoutes('es'),
};
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',
    build: {
      target: ['es2020'],
    },
    plugins: [
      analog({
        prerender: {
          routes: [
            '/',
            '/home',
            '/blog',
            '/about',
            '/contact',
            ...postRoutes.en,
            ...postRoutes.es,
          ],
          sitemap: {
            host: 'https://mrrobot.dev',
          },
        },
        nitro: {
          preset: 'vercel',
          serveStatic: false,
          externals: { inline: ['zone.js/node', 'tslib'] },
        },
      }),
      tsconfigPaths(),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      cache: {
        dir: `../node_modules/.vitest`,
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
```

y finalmente, integré el `TranslateButtonComponent`` dentro del archivo `navbar.component.ts`.

#### Probando la Integración

Ahora, para probarlo, tuve que hacer lo siguiente:

Primero, agregué la traducción inicial a los archivos en y es JSON para ver si todo estaba funcionando.

**_en.json_**

```json
{
  "home": {
    "header": "Welcome! I'm Luis Castro"
  }
}
```

**_es.json_**

```json
{
  "home": {
    "header": "¡Bienvenido! Soy Luis Castro"
  }
}
```

Luego, agregué la directiva estructural al `home.page.ts` para que transloco maneje la traducción y se suscriba automáticamente a los cambios de idioma.

```ts
@Component({
  standalone: true,
  imports: [TranslocoModule],
  template: `
    <ng-container *transloco="let t; read: 'home'">
      <section class="z-10 flex w-full flex-1 flex-col">
        <div class="hero flex-1">
          <div class="bg-opacity-60"></div>
          <div class="hero-content text-primary-content">
            <div class="max-w-md md:max-w-[80%]">
              <h1
                class="before:bg-primary after:bg-primary relative mb-5 w-fit text-3xl font-bold
                     before:absolute before:left-[98%] before:top-[70%] before:-z-10 before:h-5
                     before:w-5 before:translate-y-0 before:transition-all before:duration-500 after:absolute
                     after:left-[-15px] after:top-[70%] after:-z-10 after:h-5 after:w-5 after:translate-y-0 after:transition-all
                     after:duration-500 hover:before:translate-y-[-20px] hover:after:translate-y-[-20px] md:text-5xl">
                {{ t('header') }}
              </h1>
              <p
                class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('subheader.first') }}
                <span
                  class="bg-secondary text-secondary-content inline-block skew-y-3 border-none font-extrabold"
                  >{{ t('subheader.second') }}</span
                >
                {{ t('subheader.third') }}
              </p>
              <p
                class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('more.first') }}
                <span
                  class="inline-block skew-y-3 border-none bg-gradient-to-r from-green-600 via-white to-red-600 font-extrabold text-black"
                  >{{ t('more.second') }}</span
                >{{ t('more.third') }}
                <span
                  class="bg-secondary text-secondary-content inline-block skew-y-3 border-none font-extrabold"
                  >{{ t('more.fourth') }}</span
                >
                {{ t('more.fifth') }}
              </p>
              <p
                class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('mission') }}
              </p>
              <p
                class="mb-5 text-lg md:text-2xl md:leading-8 lg:leading-[3rem]">
                {{ t('conclusion') }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </ng-container>
  `,
})
export default class HomeIndexPage {}
```

Todo funciona como se esperaba! 🎉

#### Traduciendo Posts

Para las publicaciones, el enfoque fue un poco más complicado ya que necesitaba que el slug cambiara dependiendo del idioma, con cómo **AnalogJs** maneja el contenido pude agregar una propiedad a la publicación que llamé `otherSlug` que usé para cambiar el slug dependiendo del idioma.

```markdown
---
title: Enhancing My AnalogJs Blog with Transloco for Seamless Translations
slug: enhancing-analogjs-blog-with-transloco
otherSlug: mejorando-blog-analogjs-con-transloco
description: A step-by-step guide on how I integrated Transloco into my AnalogJs blog, ensuring content accessibility.
author: Luis Castro
coverImage: v1692660417/transloco-integration.png
date: 09-10-2023
---
```

Luego necesité hacer dos cosas para que el proceso funcionara.

La primera fue cambiar el `blog-list.component.ts` para manejar la traducción cambiando el contenido a un observable que reaccionará a los cambios de idioma.

```ts
 readonly files = injectContentFiles<PostAttributes>();
  readonly posts$: Observable<ContentFile<PostAttributes>[]> = inject(
    TranslocoService
  ).langChanges$.pipe(
    map(lang => {
      return this.files
        .filter(post => {
          const language = post.filename.split('/')[3];
          return lang === language;
        })
        .map(post => {
          const date = DateTime.fromFormat(post.attributes.date, 'MM-dd-yyyy');
          const dateString = date.toISODate();
          const language = post.filename.split('/')[3];
          return {
            ...post,
            attributes: {
              ...post.attributes,
              date: dateString as string,
              language,
            },
          };
        })
        .sort((a, b) => {
          return (
            DateTime.fromISO(b.attributes.date).toMillis() -
            DateTime.fromISO(a.attributes.date).toMillis()
          );
        });
    })
  );
```

En resumen, cada vez que cambia el idioma (detectado por TranslocoService), este código:

- Filtra las publicaciones para mostrar solo las del idioma actual.
- Modifica el formato de fecha de cada publicación y agrega el atributo de idioma.
- Ordena las publicaciones en orden descendente por fecha.
- Emite la lista modificada de publicaciones a través del observable posts$.

¿Fácil, verdad? Ahora, necesitaba hacer algo similar con el `[slug].page.ts`:

```ts
readonly allFiles = injectContentFiles<PostAttributes>();
  readonly post$ = this.#transloco.langChanges$.pipe(
    switchMap(lang => {
      return combineLatest([
        of(this.allFiles.filter(file => file.filename.split('/')[3] === lang)),
        runInInjectionContext(this.#injector, () => {
          return injectContent<PostAttributes>({
            param: 'slug',
            subdirectory: lang,
          });
        }),
      ]).pipe(
        map(([files, post]) => {
          const sortedFiles = files
            .map(file => ({
              ...file,
              attributes: {
                ...file.attributes,
                date: DateTime.fromFormat(
                  file.attributes.date,
                  'MM-dd-yyyy'
                ).toISODate()!,
              },
            }))
            .sort(
              (a, b) =>
                DateTime.fromISO(b.attributes.date).toMillis() -
                DateTime.fromISO(a.attributes.date).toMillis()
            );
          const index = sortedFiles.findIndex(
            file => file.attributes.slug === post.attributes.slug
          );
          return {
            ...post,
            nextPost: sortedFiles[index - 1]?.slug,
            previousPost: sortedFiles[index + 1]?.slug,
          };
        })
      );
    })
  );

  ngOnInit(): void {
    this.#transloco.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        const currentRoute = this.#router.url;
        // Update the route based on the new language
        const newRoute = this.updateRouteBasedOnLanguage(currentRoute, lang);
        this.#router.navigate([newRoute]);
      });
  }

  updateRouteBasedOnLanguage(route: string, lang: string): string {
    const segments = route.split('/');
    const file = this.allFiles.find(file => file.slug === segments[2]);
    const fileLang = file?.filename.split('/')[3];
    if (fileLang === lang) {
      return route;
    }
    const otherSlug = file?.attributes.otherSlug;
    segments[2] = otherSlug || segments[2];
    return segments.join('/');
  }
```

Lo que está sucediendo aquí es que, cada vez que cambia el idioma, este código:

- El observable post$ emite una publicación con propiedades adicionales que indican las siguientes y anteriores publicaciones basadas en la lista ordenada de archivos.

- El componente actualiza su ruta para reflejar el nuevo idioma. Si un archivo asociado con la ruta actual tiene una versión en otro idioma (indicado por el atributo otherSlug), la ruta se actualiza para usar esa versión.

Esto permite una buena experiencia para los lectores, ya que pueden cambiar el idioma y el slug cambiará en consecuencia.

Si quieres verlo en acción puedes hacer click en la bandera en la barra de navegación 🤣.

## Conclusion

Integrar Transloco en mi blog AnalogJs fue una decisión impulsada por el deseo de conectarme con una audiencia más amplia. No se trata solo de compartir contenido; se trata de compartir experiencias, historias y culturas. Con Transloco, he dado un paso significativo hacia la mejora de la experiencia de usuario de mi blog.

Si tienes alguna pregunta o comentario, puedes conectar conmigo en[Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). ¡Sigamos conectando culturas y compartiendo historias! 🌍🌉📖

Si te gustó el articulo, puedes apoyarme (comprandome un café)[https://www.buymeacoffee.com/luishcastrv] ☕️. Te lo agradecería mucho!
