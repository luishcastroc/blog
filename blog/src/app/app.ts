import { Component, OnInit, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { DashboardComponent } from './components/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent],
  template: ` <app-dashboard /> `,
})
export class AppComponent implements OnInit {
  private document = inject(DOCUMENT);
  private transloco = inject(TranslocoService);

  ngOnInit(): void {
    this.transloco.langChanges$.subscribe(lang => {
      this.document.documentElement.lang = lang;
    });
  }
}
