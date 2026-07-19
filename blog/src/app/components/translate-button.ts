import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { injectContentFiles } from '@analogjs/content';
import { injectSwitchLocale } from '@analogjs/router/i18n';
import { injectLocale } from '@analogjs/router/tokens';

import { PostAttributes } from '../models/post.model';

interface LocalizedPost {
  slug: string;
  otherSlug?: string;
}

export function getTranslatedPostPath(
  pathname: string,
  targetLocale: string,
  posts: readonly LocalizedPost[]
): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[1] !== 'blog' || !segments[2]) return null;

  const slug = decodeURIComponent(segments[2]);
  const post = posts.find(item => item.slug === slug);
  return post?.otherSlug
    ? `/${targetLocale}/blog/${post.otherSlug}`
    : null;
}

@Component({
  standalone: true,
  selector: 'app-translate-button',
  host: { class: 'flex' },
  imports: [NgClass],
  template: `
    <button
      class="nb-btn nb-btn--ghost nb-btn--square relative overflow-hidden"
      i18n-aria-label="@@navigation.aria-label-translate"
      aria-label="Change language to english/spanish"
      (click)="toggleLanguage()">
      <img
        class="flag-image"
        [ngClass]="getFlagClasses(true)"
        src="assets/mexico.png"
        i18n-alt="@@navigation.alt-mex"
        alt="Mexican Flag"
        height="40"
        width="40" />
      <img
        class="flag-image"
        [ngClass]="getFlagClasses(false)"
        src="assets/usa.png"
        i18n-alt="@@navigation.alt-usa"
        alt="USA Flag"
        height="40"
        width="40" />
    </button>
  `,
  styles: [
    `
      .flag-image {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    `,
  ],
})
export class TranslateButtonComponent {
  private switchLocale = injectSwitchLocale();
  private contentFiles = injectContentFiles<PostAttributes>();
  // Active locale comes from the URL prefix (defaults to 'en').
  isEnglish = (injectLocale() ?? 'en') !== 'es';

  getFlagClasses(isSpanishFlag: boolean): Record<string, boolean> {
    const isVisible = isSpanishFlag ? this.isEnglish : !this.isEnglish;

    return {
      'translate-y-[20%] rotate-[50deg] opacity-0 transition-all': !isVisible,
      'opacity-[1] transition-all duration-1000 ease-out': isVisible,
      'rotate-[100deg]': !isVisible && !isSpanishFlag,
    };
  }

  toggleLanguage(): void {
    const target = this.isEnglish ? 'es' : 'en';

    // On a blog post, jump straight to the translated slug — post slugs differ
    // per language, so keeping the same slug would 404 in the other locale.
    const translatedPath = getTranslatedPostPath(
      window.location.pathname,
      target,
      this.contentFiles.map(file => ({
        slug: file.attributes.slug || file.slug,
        otherSlug: file.attributes.otherSlug,
      }))
    );
    if (translatedPath) {
      window.location.href = translatedPath;
      return;
    }

    this.switchLocale(target);
  }
}
