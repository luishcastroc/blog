import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  TranslocoDirective,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { inject } from '@angular/core';
import { take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-translate-button',
  imports: [NgClass, TranslocoModule, TranslocoDirective],
  template: `
    <ng-container *transloco="let t; read: 'navigation'">
      <button
        class="btn btn-square btn-ghost relative h-[46px] w-10 overflow-hidden md:w-16"
        [attr.aria-label]="t('aria-label-translate')"
        (click)="changeLanguage()">
        <img
          class="flag-image"
          [ngClass]="getFlagClasses(true)"
          src="assets/mexico.png"
          [alt]="t('alt-mex')"
          height="40"
          width="40" />
        <img
          class="flag-image"
          [ngClass]="getFlagClasses(false)"
          src="assets/usa.png"
          [alt]="t('alt-usa')"
          height="40"
          width="40" />
      </button>
    </ng-container>
  `,
  styles: [
    `
      .flag-image {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    `,
  ],
})
export class TranslateButtonComponent {
  private transloco = inject(TranslocoService);

  availableLangs = this.transloco.getAvailableLangs();
  isEnglish = this.transloco.getActiveLang() === 'en';

  getFlagClasses(isSpanishFlag: boolean): Record<string, boolean> {
    const isVisible = isSpanishFlag ? this.isEnglish : !this.isEnglish;

    return {
      'translate-y-[20%] rotate-[50deg] opacity-0 transition-all': !isVisible,
      'opacity-[1] transition-all duration-1000 ease-out': isVisible,
      'rotate-[100deg]': !isVisible && !isSpanishFlag,
    };
  }

  changeLanguage(): void {
    const newLanguage = this.isEnglish ? 'es' : 'en';

    this.transloco
      .load(newLanguage)
      .pipe(take(1))
      .subscribe(() => {
        this.transloco.setActiveLang(newLanguage);
      });

    this.isEnglish = !this.isEnglish;
  }
}
