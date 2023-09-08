import { Component, OnInit, inject } from '@angular/core';
import { DashboardComponent } from './components/dashboard.component';
import { TranslocoService } from '@ngneat/transloco';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'blog-root',
  standalone: true,
  imports: [DashboardComponent],
  template: ` <mr-dashboard /> `,
})
export class AppComponent implements OnInit {
  #document = inject(DOCUMENT);
  #meta = inject(Meta);
  #transloco = inject(TranslocoService);

  ngOnInit(): void {
    this.#transloco.langChanges$.subscribe(lang => {
      this.#document.documentElement.lang = lang;
      const metaDescription = this.#transloco.translate('meta.description');
      const twitterDescription = this.#transloco.translate(
        'meta.twitter-description'
      );
      if (metaDescription && metaDescription !== 'meta.description') {
        this.#meta.updateTag({ name: 'description', content: metaDescription });
      }
      if (
        twitterDescription &&
        twitterDescription !== 'meta.twitter-description'
      ) {
        this.#meta.updateTag({
          name: 'twitter:description',
          content: twitterDescription,
        });
      }
    });
  }
}
