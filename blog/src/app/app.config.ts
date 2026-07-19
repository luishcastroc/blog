import { ApplicationConfig, inject } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { APP_BASE_HREF, provideCloudinaryLoader } from '@angular/common';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { provideFileRouter } from '@analogjs/router';
import { provideI18n } from '@analogjs/router/i18n';
import { LOCALE } from '@analogjs/router/tokens';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideSvgIcons } from '@ngneat/svg-icon';
import { svgIcons } from './svg-icons';
import { withViewTransitions } from '@angular/router';
import { withPrismHighlighter } from '@analogjs/content/prism-highlighter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideContent(withMarkdownRenderer(), withPrismHighlighter()),
    provideHttpClient(withFetch()),
    provideFileRouter(withViewTransitions({ skipInitialTransition: true })),
    provideI18n({
      loader: async locale => (await import(`../i18n/${locale}.json`)).default,
    }),
    // Locale lives in the URL as a path prefix (/en, /es). Set the router's
    // base href to that prefix so Angular strips it before matching routes
    // (e.g. /es/home -> /home) and routerLinks stay within the active locale.
    {
      provide: APP_BASE_HREF,
      useFactory: () => `/${inject(LOCALE, { optional: true }) ?? 'en'}/`,
    },
    provideSvgIcons([...svgIcons]),
    provideHotToastConfig(),
    provideCloudinaryLoader('https://res.cloudinary.com/lhcc0134'),
  ],
};
