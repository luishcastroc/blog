import { HotToastModule } from '@ngneat/hot-toast';
import { provideClientHydration } from '@angular/platform-browser';
import { provideCloudinaryLoader } from '@angular/common';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { provideFileRouter } from '@analogjs/router';
import { provideHttpClient } from '@angular/common/http';
import { provideSvgIcons } from '@ngneat/svg-icon';
import { getBrowserLang, provideTransloco } from '@ngneat/transloco';
import { svgIcons } from './svg-icons';
import { TranslocoHttpLoader } from './transloco-loader';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideContent(withMarkdownRenderer()),
    provideHttpClient(),
    provideFileRouter(),
    provideSvgIcons([...svgIcons]),
    importProvidersFrom(HotToastModule.forRoot()),
    provideCloudinaryLoader('https://res.cloudinary.com/lhcc0134'),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: getBrowserLang() || 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
