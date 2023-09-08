import { Component, inject, OnInit } from '@angular/core';
import { DashboardComponent } from './components/dashboard.component';
import { DOCUMENT } from '@angular/common';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'blog-root',
  standalone: true,
  imports: [DashboardComponent],
  template: ` <mr-dashboard /> `,
})
export class AppComponent implements OnInit {
  #document = inject(DOCUMENT);
  #transloco = inject(TranslocoService);

  ngOnInit(): void {
    this.#transloco.langChanges$.subscribe(lang => {
      this.#document.documentElement.lang = lang;
    });
  }
}
