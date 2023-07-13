import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFileRouter } from '@analogjs/router';
import { provideHttpClient } from '@angular/common/http';
import { provideSvgIcons } from '@ngneat/svg-icon';
import { darkModeIcon } from '@app/svg/dark-mode';
import { twitterIcon } from '@app/svg/twitter';
import { githubIcon } from '@app/svg/github';
import { threadsIcon } from '@app/svg/threads';
import { lightIcon } from '@app/svg/light';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(),
    provideClientHydration(),
    provideHttpClient(),
    provideSvgIcons([
      darkModeIcon,
      twitterIcon,
      githubIcon,
      threadsIcon,
      lightIcon,
    ]),
  ],
};
