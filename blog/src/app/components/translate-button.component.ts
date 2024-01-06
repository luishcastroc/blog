import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Subscription, take } from 'rxjs';
import {
  TranslocoModule,
  TranslocoService,
  TranslocoDirective,
} from '@ngneat/transloco';

@Component({
  selector: 'mr-translate-button',
  standalone: true,
  imports: [NgClass, TranslocoModule, TranslocoDirective],
  template: `<ng-container *transloco="let t; read: 'navigation'">
    <button
      class="btn btn-square btn-ghost relative h-[46px] w-10 overflow-hidden md:w-16"
      [attr.aria-label]="t('aria-label-translate')"
      (click)="changeLanguage()">
      <img
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        [ngClass]="{
          'translate-y-[20%] rotate-[50deg] opacity-0 transition-all':
            !toggleLang,
          'opacity-[1] transition-all duration-1000 ease-out': toggleLang
        }"
        src="assets/mexico.png"
        [alt]="t('alt-mex')"
        height="40"
        width="40" />
      <img
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        [ngClass]="{
          'opacity-[1] transition-all duration-1000 ease-out': !toggleLang,
          'translate-y-[20%] rotate-[100deg] opacity-0 transition-all':
            toggleLang
        }"
        src="assets/usa.png"
        [alt]="t('alt-usa')"
        height="40"
        width="40" />
    </button>
  </ng-container> `,
})
export class TranslateButtonComponent {
  #transloco = inject(TranslocoService);
  availableLangs = this.#transloco.getAvailableLangs();
  toggleLang = this.#transloco.getActiveLang() === 'en' ? true : false;
  private subscription!: Subscription | null;

  get activeLang() {
    return this.#transloco.getActiveLang();
  }

  changeLanguage() {
    const lang = this.activeLang === 'en' ? 'es' : 'en';

    this.subscription?.unsubscribe();
    this.subscription = this.#transloco
      .load(lang)
      .pipe(take(1))
      .subscribe(() => {
        this.#transloco.setActiveLang(lang);
      });

    this.toggleLang = !this.toggleLang;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }
}
