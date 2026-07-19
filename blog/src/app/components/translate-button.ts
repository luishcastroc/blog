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
  template: `
    <!-- Language codes, not flags: flags name countries, not languages. Both
         codes stay visible with the active one marked, so the toggle's state
         and target are explicit. -->
    <button
      class="nb-btn nb-btn--ghost lang-btn"
      i18n-aria-label="@@navigation.aria-label-translate"
      aria-label="Change language to english/spanish"
      (click)="toggleLanguage()">
      <span class="lang-code" [class.lang-code--active]="isEnglish">EN</span>
      <span aria-hidden="true">/</span>
      <span class="lang-code" [class.lang-code--active]="!isEnglish">ES</span>
    </button>
  `,
  styles: [
    `
      .lang-btn {
        gap: 0.3rem;
        padding: 0 0.65rem;
      }

      .lang-code {
        padding: 0.1rem 0.3rem;
        color: var(--muted);
        transition:
          background-color 0.15s ease,
          color 0.15s ease;
      }

      .lang-code--active {
        background: var(--red);
        color: var(--on-red);
      }
    `,
  ],
})
export class TranslateButtonComponent {
  private switchLocale = injectSwitchLocale();
  private contentFiles = injectContentFiles<PostAttributes>();
  // Active locale comes from the URL prefix (defaults to 'en').
  isEnglish = (injectLocale() ?? 'en') !== 'es';

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
