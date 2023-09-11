---
title: Enhancing My AnalogJs Blog with Transloco for Seamless Translations
slug: enhancing-analogjs-blog-with-transloco
otherSlug: mejorando-blog-analogjs-con-transloco
description: A step-by-step guide on how I integrated Transloco into my AnalogJs blog, ensuring content accessibility.
author: Luis Castro
coverImage: v1692660417/transloco-integration.png
date: 09-10-2023
---

## Introduction

Being a Mexican living in the US, I've always valued the importance of bilingualism. It's not just about communication; it's about bridging cultures. With this in mind, I decided to integrate Transloco into my AnalogJs blog, making my content more accessible.

## The Bilingual Vision for My Blog

So, the idea is this: When you first land on my blog, it'll check your browser's language setting. If it's set to Spanish, you'll see the content in Spanish; if it's anything else, you'll get English by default. But I wanted to give readers control too. That's where the flag button comes in. Located at a noticeable spot on the page, this button lets you toggle between English (with a USA flag) and Spanish (with a Mexican flag). Just a click, and the entire blog switches languages in real-time. Simple, right? While we're starting with these two languages, this sets the groundwork for possibly adding more in the future.

## Transloco: Seamless Content Translations

Transloco is an Angular i18n solution that allows for defining translations in various languages and switching between them seamlessly. Some of its core functionalities include:

- **Clean and DRY Templates**: Ensuring templates remain concise and non-repetitive.
- **Lazy Load Support**: On-demand translation file loading for optimized performance.
- **Rich Plugins**: A diverse ecosystem catering to both development and production needs.
- **Multiple Fallbacks**: Comprehensive support for fallbacks, ensuring content availability.
- **SSR Support**: Compatibility with Angular SSR, allowing for pre-rendered translations.

For a more in-depth look at Transloco, you can refer to the [official Transloco documentation](https://ngneat.github.io/transloco/).

## Integration Steps

1. **Installation**: I began by installing Transloco using.

```shell
pnpm add @ngneat/transloco.
```

2. **Configuration**: Using the schematic, I added the necessary configuration from the generator. It's crucial to set the SSR to true to pre-render translations, ensuring a seamless user experience.

```shell
pnpx nx g @ngneat/transloco:ng-add --blog
```

#### Setting Up the Transloco Loader

The first step was to set up the transloco-loader.ts file, which would load the translation files, specifically the es.json and en.json files.

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

#### Organizing Translation Files

I organized the translation files inside the assets directory, which included the languages I selected during setup ('en' and 'es') in the form of JSON files.

#### Handling Browser Language Settings

Instead of using the route to determine the active language, I utilized the browser language to determine the active language, ensuring even the blog post slugs were translated. For this, I created a component named translate-button.component.ts.

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

#### Organizing Blog Posts

To differentiate between English and Spanish posts, I organized my blog posts as follows:

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

This approach required more effort but was essential for compatibility with SSR.

#### Vite Configuration

I then modified the Vite configuration to pre-render the files:

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
      `/blog/${language}/${post
        .replace('.md', '')
        .replace(/^\d{4}-\d{2}-\d{2}-/, '')}`
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

and finally i integrated the `TranslateButtonComponent` inside the `navbar.component.ts` file.

#### Testing the Integration

Now, to test it out, I had to do the following:

First, I added the initial translation to the en and es JSON files to see if everything was working. I added the first header to both files:

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

Then, I added the structural directive to the `home.page.ts` for transloco to handle the translation and subscribe automatically to the language changes.

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

Everything works as expected! 🎉

#### Translating Posts

For the posts the approach was a little more tricky since i needed the slug to change depending on the language, with how **AnalogJs** handles the content i was able to add a property to the post that i called `otherSlug` which i used to change the slug depending on the language.

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

Then i needed to do two things to make the process work

the first one was to change the `blog-list.component.ts` to handle the translation by changing the content to an observable that will react to the language changes.

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

In summary, whenever the language changes (as detected by TranslocoService), this code will:

- Filter the posts to only those of the current language.
- Modify the date format of each post and add the language attribute.
- Sort the posts in descending order by date.
- Emit the modified list of posts through the posts$ observable.

Easy, right? Now, I needed to do something similar with the `[slug].page.ts` :

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

What is happening here? Well, whenever the language changes, this code will:

- The post$ observable emits a post with additional properties indicating the next and previous posts based on the sorted list of files.

- The component updates its route to reflect the new language. If a file associated with the current route has a different language version (indicated by the otherSlug attribute), the route is updated to use that version.

This allows a good experience for the readers since they can change the language and the slug will change accordingly.

if you want to see it in action you can check my [blog](https://mrrobot.dev/blog) and try it out.

## Conclusion

Integrating Transloco into my AnalogJs blog was a decision driven by the desire to connect with a broader audience. It's not just about sharing content; it's about sharing experiences, stories, and cultures. With Transloco, I've taken a significant step towards enhancing my blog's user experience.

If you have any questions or feedback, feel free to connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Let's continue to bridge cultures and share stories! 🌍🌉📖
