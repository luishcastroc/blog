import { Component, inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { injectLocale } from '@analogjs/router/tokens';

import { DashboardComponent } from './components/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent],
  template: ` <app-dashboard /> `,
})
export class AppComponent implements OnInit {
  private document = inject(DOCUMENT);
  private locale = injectLocale() ?? 'en';

  ngOnInit(): void {
    this.document.documentElement.lang = this.locale;
  }
}
