import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { provideFileRouter } from '@analogjs/router';
import { provideHttpClient } from '@angular/common/http';
import { provideSvgIcons } from '@ngneat/svg-icon';
import { HotToastModule } from '@ngneat/hot-toast';
import { provideCloudinaryLoader } from '@angular/common';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
import { svgIcons } from './svg-icons';

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
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
