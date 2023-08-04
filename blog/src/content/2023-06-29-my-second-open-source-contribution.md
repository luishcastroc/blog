---
title: My Second Open Source Contribution, The AnalogJS Journey
slug: my-second-open-source-contribution
description: Venturing into the realm of open source contributions
coverImage: /assets/cover-images/oss-cover.webp
date: 06-29-2023
---

Venturing into the realm of open source contributions can be daunting, especially for newcomers. This is the story of my maiden voyage into this exciting world, where I aimed to contribute to [AnalogJS](https://analogjs.org), an Angular meta-framework.

## Finding a Good First Issue

In general, a good starting point is to explore the _issues_ tab of the project you're interested in. Often, maintainers will kindly label some issues with "good first issue", easing the fear of diving headfirst into the deep end of the project. However, this time around, I wasn't able to spot such a tag, so I took it upon myself to tackle an issue involving the elimination of some deprecation messages.

Before we go further, let's understand a little more about AnalogJS.

## AnalogJS: A Brief Overview

AnalogJS, as defined in the project's documentation, is a fullstack meta-framework for building applications and websites with Angular. Drawing parallels with other meta-frameworks such as Next.JS, Nuxt, SvelteKit, Qwik City, and others, Analog offers a similar experience, but with an Angular twist.

Here are some features that make AnalogJS stand out:

- Supports Vite/Vitest/Playwright
- File-based routing
- Support for using markdown as content routes
- Support for API/server routes
- Hybrid SSR/SSG support
- Supports Angular CLI/Nx workspaces
- Supports Angular components with Astro

With that said, let's return to the deprecation issue at hand.

## The Deprecation Messages

The deprecation messages I aimed to fix were:

```shell
marked(): highlight and langPrefix parameters are deprecated since version 5.0.0, should not be used and will be removed in the future. Instead use https://www.npmjs.com/package/marked-highlight.

marked(): mangle parameter is enabled by default, but is deprecated since version 5.0.0, and will be removed in the future. To clear this warning, install https://www.npmjs.com/package/marked-mangle, or disable by setting `{mangle: false}`.

marked(): headerIds and headerPrefix parameters enabled by default, but are deprecated since version 5.0.0, and will be removed in the future. To clear this warning, install  https://www.npmjs.com/package/marked-gfm-heading-id, or disable by setting `{headerIds: false}`.
```

The maintainers had helpfully hinted at the code that needed alteration, located in `packages/content/src/lib/markdown-content-renderer.service.ts`.

## Diving into the Code

To avoid wreaking havoc on the original codebase, I began by forking the repository, which would allow me to work on my own copy. I then navigated to the aforementioned service, which looked something like this:

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

Armed with the location of the code and the deprecation messages as my guide, I began to dig into the [marked library documentation](https://marked.js.org). The deprecation messages provided a roadmap for the changes needed to resolve the issue.

I realized I needed to replace the deprecated parameters with the recommended alternatives. This included replacing the `highlight` and `langPrefix` parameters with a new package `marked-highlight`, adjusting the `mangle` parameter by either installing the `marked-mangle` package or by setting `{mangle: false}`, and lastly, handling the `headerIds` and `headerPrefix` parameters by either integrating the `marked-gfm-heading-id` package or by setting `{headerIds: false}`.

Having understood the required changes from the documentation, I moved onto the next step: amending the code in my forked repository.

One of them was really straightforward since it was functionality not really used in the implementation:

```shell
marked(): mangle parameter is enabled by default, but is deprecated since version 5.0.0, and will be removed in the future. To clear this warning, install https://www.npmjs.com/package/marked-mangle, or disable by setting `{mangle: false}`.
```

This message was resolved by just adding the proper flag as false (as stated in the message itself).

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

Piece of cake! Now with the excitement of being able to fix things, I thought the next one was going to be as easy as this, and my incoming contribution to this project was imminent. But I was wrong.

The next two messages were for things that were actually part of the implementation:

## GFM Heading ids

A GFM (GitHub Flavored Markdown) heading ID is the identifier that GitHub automatically assigns to each heading in a markdown file. It allows you to link directly to a specific section within a document.

## Highlighting

Markdown code syntax highlighting is a feature offered by many text editors, markdown viewers, and websites like GitHub. It enhances the readability of code snippets embedded in markdown documents by applying color and style differentiation. When you enclose code within markdown's code blocks (using backticks), and specify the language, the system recognizes the syntax of that particular language and applies appropriate color-coding. This makes elements such as keywords, variables, strings, or comments in the code easily distinguishable, aiding in comprehending the code snippet's structure and logic. This becomes particularly valuable when sharing code, discussing solutions, or documenting code behavior within markdown files.

With that information and based on the documentation and the message, 2 new packages were needed that were replacing that functionality.

**marked-gfm-heading-id** and **marked-highlight**

So, I proceeded to add them to the repo by using:

```shell
pnpm add marked-highlight marked-gfm-heading-id -w
```

After adding the dependencies, I proceeded to use them as the documentation was recommending and ended up with something like this:

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

At first glance, it seemed straightforward. I replaced `marked.setOptions` with `marked.use` and made the necessary changes to incorporate the new extensions. Additionally, I removed the highlight function from the renderer, as it was also deprecated. Ultimately, the only process we needed was one to format the code properly for PrismJS (the library used for adding colorful highlights) based on the provided language.

Everything seemed to be in order, and I even added a unit test to facilitate the process. However, due to my limited understanding of the code at that time, I didn't fully utilize the tools that the project already provided for testing. After an initial PR, the project's main maintainer, [Brandon Roberts](https://github.com/brandonroberts), informed me that it wasn't functioning properly and that there was an actual app inside the project for more comprehensive testing (in conjunction with the unit tests).

Upon examining the app and noticing that the highlight feature wasn't working correctly and required a page refresh to display the code with the correct format, I started investigating potential issues.

The first problem I encountered was that after some time of clicking on the app's links, they would simply freeze, causing Chrome to crash. Clearly, this issue didn't exist before, so it was most likely related to my implementation and the supposed "fix".

After numerous attempts at troubleshooting, online searches, and even consulting with ChatGPT, I decided to start a discussion on Marked's GitHub ([link](https://github.com/markedjs/marked/discussions/2861) if you're interested). I received a prompt response from one of the maintainers, who directed me towards what seemed to be the right solution at that time.

It appeared that each call to `marked.use` created a new instance of the extension, which could potentially cause significant problems depending on the usage. After some research into how the issue was addressed, I came up with this solution (credits to icebaker for the [original solution](https://github.com/markedjs/marked-highlight/issues/26#issuecomment-1570188027)).

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

Simple, isn't it? The quick explanation for this approach is that, now, if the process calls for another instance of `marked.use`, the `Marked.instantiated` variable indicates that an instance is already available and will provide that one.

However, as Brandon pointed out during the PR review, this method isn't in line with Angular's practices. He suggested creating an Angular service that could fully utilize the benefits of Angular's [Dependency Injection](https://angular.io/guide/dependency-injection). After implementing some changes, we arrived at the final solution:

I created a service named `marked-setup.service.ts` to manage the setup for Marked and PrismJS. Here's what it looks like:

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

To break it down simply, we generate an instance of the marked library within the constructor. This instance is equipped with all the necessary extensions and options to offer the same functionality as it did previously. Then, this instance can be accessed via the getMarkedInstance() method.

The journey doesn't end there. Now, the service needed to be consumed within another service. After some refactoring, we ended up with the following implementation:

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

A crucial detail to remember is that we employ `inject(MarkedSetupService)` to incorporate the dependency into the consuming service. You can disregard the `{ self: true }` segment, as it doesn't have a role in this context and is most likely a typing error. The core operation happens here:

```ts
export function provideContent(...features: Provider[]) {
  return [...features, MarkedSetupService];
}
```

In this section, we instruct Angular to supply an instance of MarkedSetupService. If a service is provisioned in another service, Angular will generate a new instance of the provided service for each new instance of the consuming service. If the consuming service is a singleton, the provided service will also be a singleton.

Upon re-running the unit tests and resubmitting the PR, the response was favorable, and the PR was successfully merged.

Thank you for reading. I hope this journey has been informative and enjoyable!
