import { AsyncPipe, NgIf } from '@angular/common';
import {
  Subject,
  combineLatest,
  map,
  of,
  skip,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { DateTime } from 'luxon';
import { PostAttributes } from '../../models/post.model';
import { postMetaResolver, postTitleResolver } from '../../models/resolvers';
import { RouteMeta } from '@analogjs/router';
import { Router, RouterLinkWithHref } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import {
  injectContent,
  injectContentFiles,
  MarkdownComponent,
} from '@analogjs/content';
import {
  Component,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  runInInjectionContext,
} from '@angular/core';

export const routeMeta: RouteMeta = {
  title: postTitleResolver,
  meta: postMetaResolver,
};

@Component({
  standalone: true,
  imports: [MarkdownComponent, AsyncPipe, NgIf, RouterLinkWithHref],
  host: { class: 'px-0' },
  template: `
    <article
      class="text-primary-content flex w-full flex-auto flex-col items-center gap-4 overflow-auto"
      *ngIf="post$ | async as post">
      <section
        class="mb-4 flex w-full flex-auto flex-row justify-between gap-4 lg:w-3/5">
        <button
          [routerLink]="['/blog', post.previousPost]"
          [disabled]="!post.previousPost"
          class="btn btn-accent w-28"
          type="button"
          aria-label="Previous Blog Post">
          Previous</button
        ><button
          [routerLink]="['/blog', post.nextPost]"
          [disabled]="!post.nextPost"
          class="btn btn-accent w-28"
          type="button"
          aria-label="Next Blog Post">
          Next
        </button>
      </section>
      <h1 class="self-center text-center text-3xl font-extrabold lg:w-3/5">
        {{ post.attributes.title }}
      </h1>
      <div
        class="line-numbers blog-post container w-full pb-8 pt-4 md:w-11/12 md:px-0 lg:w-3/5">
        <analog-markdown [content]="post.content"></analog-markdown>
      </div>
    </article>
  `,
})
export default class BlogPostComponent implements OnInit, OnDestroy {
  #transloco = inject(TranslocoService);
  #router = inject(Router);
  #injector = inject(Injector);
  destroy$ = new Subject<boolean>();

  readonly allFiles = injectContentFiles<PostAttributes>();
  readonly post$ = this.#transloco.langChanges$.pipe(
    switchMap(lang => {
      return combineLatest([
        of(this.allFiles.filter(file => file.filename.split('/')[3] === lang)),
        runInInjectionContext(this.#injector, () => {
          return injectContent<PostAttributes>({
            param: 'slug',
            subdirectory: lang,
          });
        }),
      ]).pipe(
        map(([files, post]) => {
          const sortedFiles = files
            .map(file => ({
              ...file,
              attributes: {
                ...file.attributes,
                date: DateTime.fromFormat(
                  file.attributes.date,
                  'MM-dd-yyyy'
                ).toISODate()!,
              },
            }))
            .sort(
              (a, b) =>
                DateTime.fromISO(b.attributes.date).toMillis() -
                DateTime.fromISO(a.attributes.date).toMillis()
            );
          const index = sortedFiles.findIndex(
            file => file.attributes.slug === post.attributes.slug
          );
          return {
            ...post,
            nextPost: sortedFiles[index - 1]?.slug,
            previousPost: sortedFiles[index + 1]?.slug,
          };
        })
      );
    })
  );

  ngOnInit(): void {
    this.#transloco.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        const currentRoute = this.#router.url;
        // Update the route based on the new language
        const newRoute = this.updateRouteBasedOnLanguage(currentRoute, lang);
        this.#router.navigate([newRoute]);
      });
  }

  updateRouteBasedOnLanguage(route: string, lang: string): string {
    const segments = route.split('/');
    const file = this.allFiles.find(file => file.slug === segments[2]);
    const fileLang = file?.filename.split('/')[3];
    if (fileLang === lang) {
      return route;
    }
    const otherSlug = file?.attributes.otherSlug;
    segments[2] = otherSlug || segments[2];
    return segments.join('/');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
