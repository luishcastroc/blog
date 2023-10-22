import { AsyncPipe, NgFor } from '@angular/common';
import { BlogCoverComponent } from './blog-cover.component';
import { Component, inject } from '@angular/core';
import { ContentFile, injectContentFiles } from '@analogjs/content';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';
import { PostAttributes } from '../models/post.model';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'mr-blog-list',
  standalone: true,
  imports: [NgFor, BlogCoverComponent, AsyncPipe],
  template: `
    <div
      class="flex flex-col flex-wrap justify-center gap-8 overflow-auto pb-4 pt-4 lg:flex-row lg:gap-6 ">
      <ng-container *ngFor="let post of posts$ | async">
        <mr-cover [post]="post" />
      </ng-container>
    </div>
  `,
})
export class BlogListComponent {
  readonly files = injectContentFiles<PostAttributes>();
  readonly posts$: Observable<ContentFile<PostAttributes>[]> = inject(
    TranslocoService
  ).langChanges$.pipe(
    map(lang => {
      return this.files
        .filter(post => {
          const language = post.filename.split('/')[3];
          return lang === language;
        })
        .map(post => {
          const date = DateTime.fromFormat(post.attributes.date, 'MM-dd-yyyy');
          const dateString = date.toISODate();
          const language = post.filename.split('/')[3];
          return {
            ...post,
            attributes: {
              ...post.attributes,
              date: dateString as string,
              language,
            },
          };
        })
        .sort((a, b) => {
          return (
            DateTime.fromISO(b.attributes.date).toMillis() -
            DateTime.fromISO(a.attributes.date).toMillis()
          );
        });
    })
  );
}
