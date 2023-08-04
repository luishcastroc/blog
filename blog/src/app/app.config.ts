import { ApplicationConfig } from '@angular/core';
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
  ],
};
