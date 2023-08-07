import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { darkModeIcon } from '@app/svg/dark-mode';
import { githubIcon } from '@app/svg/github';
import { lightIcon } from '@app/svg/light';
import { linkedinIcon } from './svg/linkedin';
import { provideClientHydration } from '@angular/platform-browser';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { provideFileRouter } from '@analogjs/router';
import { provideHttpClient } from '@angular/common/http';
import { provideSvgIcons } from '@ngneat/svg-icon';
import { threadsIcon } from '@app/svg/threads';
import { twitterIcon } from '@app/svg/twitter';
import { HotToastModule } from '@ngneat/hot-toast';
import { provideCloudinaryLoader } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideContent(withMarkdownRenderer()),
    provideHttpClient(),
    provideFileRouter(),
    provideSvgIcons([
      darkModeIcon,
      twitterIcon,
      githubIcon,
      threadsIcon,
      lightIcon,
      linkedinIcon,
    ]),
    importProvidersFrom(HotToastModule.forRoot()),
    provideCloudinaryLoader('https://res.cloudinary.com/lhcc0134'),
  ],
};
