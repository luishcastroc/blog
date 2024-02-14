import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  #http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.#http.get<Translation>(
      `${import.meta.env['VITE_BASE_URL']}/assets/i18n/${lang}.json`
    );
  }
}
