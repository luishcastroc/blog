import { DOCUMENT, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { filter } from 'rxjs';

import { MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { injectLocale } from '@analogjs/router/tokens';

import { postMetaResolver, postTitleResolver } from '../../models/resolvers';
import { injectPostWithNavigation } from './post-navigation';
import { TocSpyDirective } from './toc-spy';

export const routeMeta: RouteMeta = {
  title: postTitleResolver,
  meta: postMetaResolver,
};

@Component({
  selector: 'app-blog-post',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownComponent,
    RouterLink,
    NgOptimizedImage,
    NgTemplateOutlet,
    TocSpyDirective,
  ],
  host: { class: 'px-0' },
  template: `
    @let postItem = post();
    @if (postItem) {
      <div class="post-layout mx-auto w-full">
        <article
          class="post-article text-ink flex w-full min-w-0 max-w-3xl flex-col gap-6">
          <ng-container [ngTemplateOutlet]="postNav" />

          @if (postItem.attributes.coverImage) {
            <img
              [ngSrc]="postItem.attributes.coverImage"
              width="1000"
              height="420"
              priority
              alt=""
              class="border-3 border-ink shadow-nb w-full object-cover" />
          }

          <h1
            class="font-display text-ink text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            {{ postItem.attributes.title }}
          </h1>

          <!-- On this page — mobile collapsible -->
          @if (spy.toc().length) {
            <details class="nb-panel toc-details xl:hidden">
              <summary i18n="@@blog.on-this-page">On this page</summary>
              <ng-container [ngTemplateOutlet]="tocList" />
            </details>
          }

          <div
            appTocSpy
            #spy="appTocSpy"
            class="line-numbers blog-post w-full pb-4 pt-2">
            <analog-markdown [content]="postItem.content" />
          </div>

          <!-- Prev/next repeated at the end, where readers expect it -->
          <ng-container [ngTemplateOutlet]="postNav" />
        </article>

        <!-- On this page — desktop sticky sidebar -->
        @if (spy.toc().length) {
          <aside class="post-toc hidden xl:block">
            <nav
              class="sticky top-28"
              i18n-aria-label="@@blog.on-this-page"
              aria-label="On this page">
              <p class="toc-heading" i18n="@@blog.on-this-page">On this page</p>
              <ng-container [ngTemplateOutlet]="tocList" />
            </nav>
          </aside>
        }
      </div>

      <ng-template #postNav>
        <nav
          class="flex w-full items-center justify-between gap-4"
          i18n-aria-label="@@blog.aria-post-navigation"
          aria-label="Post navigation">
          <button
            [routerLink]="['/blog', post()?.previousPost]"
            [disabled]="!post()?.previousPost"
            class="nb-btn nb-btn--ghost"
            type="button"
            i18n-aria-label="@@blog.aria-previous"
            aria-label="Previous Post">
            ← <span i18n="@@blog.previous">Previous</span>
          </button>
          <button
            [routerLink]="['/blog', post()?.nextPost]"
            [disabled]="!post()?.nextPost"
            class="nb-btn nb-btn--ghost"
            type="button"
            i18n-aria-label="@@blog.aria-next"
            aria-label="Next Post">
            <span i18n="@@blog.next">Next</span> →
          </button>
        </nav>
      </ng-template>

      <ng-template #tocList>
        <ul class="toc-list">
          @for (item of spy.toc(); track item.id) {
            <li>
              <a
                [href]="'#' + item.id"
                class="toc-link"
                [class.toc-link--h3]="item.level === 3"
                [class.toc-link--active]="spy.activeId() === item.id"
                [attr.aria-current]="spy.activeId() === item.id ? 'true' : null"
                (click)="onTocLink($event, item.id)">
                {{ item.text }}
              </a>
            </li>
          }
        </ul>
      </ng-template>
    }
  `,
})
export default class BlogPostComponent {
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  // Active locale comes from the URL prefix (defaults to 'en').
  private readonly locale = injectLocale() ?? 'en';

  private readonly spy = viewChild(TocSpyDirective);

  readonly post = injectPostWithNavigation(this.locale);

  constructor() {
    inject(Router)
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef))
      )
      .subscribe(() => this.resetArticlePosition());
  }

  onTocLink(event: Event, id: string): void {
    // Handle scrolling ourselves: the app has a <base href> so a plain "#id"
    // anchor would resolve against the base URL (the site root) and navigate
    // home instead of scrolling to the section.
    event.preventDefault();
    // Collapse the mobile "On this page" panel after picking a section.
    (event.target as HTMLElement).closest('details')?.removeAttribute('open');
    this.spy()?.scrollTo(id);

    // Reflect the section in the URL (shareable) without triggering navigation.
    const win = this.document.defaultView;
    if (win) {
      win.history.replaceState(
        null,
        '',
        `${win.location.pathname}${win.location.search}#${id}`
      );
    }
  }

  private resetArticlePosition(): void {
    this.spy()?.reset();
    afterNextRender(
      {
        write: () =>
          this.document.defaultView?.scrollTo({ top: 0, behavior: 'auto' }),
      },
      { injector: this.injector }
    );
  }
}
