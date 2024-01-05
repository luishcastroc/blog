import { ApplicationConfig, isDevMode } from '@angular/core';
import { getBrowserLang, provideTransloco } from '@ngneat/transloco';
import { provideClientHydration } from '@angular/platform-browser';
import { provideCloudinaryLoader } from '@angular/common';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { provideFileRouter } from '@analogjs/router';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideSvgIcons } from '@ngneat/svg-icon';
import { svgIcons } from './svg-icons';
import { TranslocoHttpLoader } from './transloco-loader';
import { withViewTransitions } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideContent(withMarkdownRenderer()),
    provideHttpClient(withFetch()),
    provideFileRouter(withViewTransitions()),
    provideSvgIcons([...svgIcons]),
    provideHotToastConfig(),
    provideCloudinaryLoader('https://res.cloudinary.com/lhcc0134'),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: getBrowserLang() || 'en',
        fallbackLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
