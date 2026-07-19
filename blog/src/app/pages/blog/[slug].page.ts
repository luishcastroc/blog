import { DOCUMENT, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DateTime } from 'luxon';
import { combineLatest, map, of } from 'rxjs';

import {
  injectContent,
  injectContentFiles,
  MarkdownComponent,
} from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { injectLocale } from '@analogjs/router/tokens';

import { PostAttributes } from '../../models/post.model';
import { postMetaResolver, postTitleResolver } from '../../models/resolvers';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const routeMeta: RouteMeta = {
  title: postTitleResolver,
  meta: postMetaResolver,
};

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [MarkdownComponent, RouterLink, NgOptimizedImage, NgTemplateOutlet],
  host: { class: 'px-0' },
  template: `
    @let postItem = post();
    @if (postItem) {
      <div class="post-layout mx-auto w-full">
        <article
          class="post-article flex w-full min-w-0 max-w-3xl flex-col gap-6 text-ink">
          <ng-container [ngTemplateOutlet]="postNav" />

          @if (postItem.attributes.coverImage) {
            <img
              [ngSrc]="postItem.attributes.coverImage"
              width="1000"
              height="420"
              priority
              alt=""
              class="w-full border-3 border-ink object-cover shadow-nb" />
          }

          <h1
            class="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
            {{ postItem.attributes.title }}
          </h1>

          <!-- On this page — mobile collapsible -->
          @if (toc().length) {
            <details class="nb-panel toc-details xl:hidden">
              <summary i18n="@@blog.on-this-page">On this page</summary>
              <ng-container [ngTemplateOutlet]="tocList" />
            </details>
          }

          <div #body class="line-numbers blog-post w-full pb-4 pt-2">
            <analog-markdown [content]="postItem.content" />
          </div>

          <!-- Prev/next repeated at the end, where readers expect it -->
          <ng-container [ngTemplateOutlet]="postNav" />
        </article>

        <!-- On this page — desktop sticky sidebar -->
        @if (toc().length) {
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
          @for (item of toc(); track item.id) {
            <li>
              <a
                [href]="'#' + item.id"
                class="toc-link"
                [class.toc-link--h3]="item.level === 3"
                [class.toc-link--active]="activeId() === item.id"
                [attr.aria-current]="activeId() === item.id ? 'true' : null"
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
export default class BlogPostComponent implements OnDestroy {
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  // Active locale comes from the URL prefix (defaults to 'en').
  private readonly locale = injectLocale() ?? 'en';

  private readonly contentFiles = injectContentFiles<PostAttributes>();
  private redirected = false;

  private readonly bodyRef = viewChild<ElementRef<HTMLElement>>('body');

  readonly toc = signal<TocItem[]>([]);
  readonly activeId = signal('');

  private observer?: IntersectionObserver;
  private contentObserver?: MutationObserver;
  private rebuildTimer?: ReturnType<typeof setTimeout>;
  private watching = false;

  post = toSignal(this.getPostWithNavigation(this.locale), {
    initialValue: null,
  });

  constructor() {
    // Once the article body exists, watch it and keep the table of contents in
    // sync — including when prev/next reuses this component for another post.
    effect(() => {
      const el = this.bodyRef()?.nativeElement;
      if (el && !this.watching) {
        this.watching = true;
        this.watchContent(el);
      }
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.contentObserver?.disconnect();
    if (this.rebuildTimer) clearTimeout(this.rebuildTimer);
  }

  onTocLink(event: Event, id: string): void {
    // Handle scrolling ourselves: the app has a <base href> so a plain "#id"
    // anchor would resolve against the base URL (the site root) and navigate
    // home instead of scrolling to the section.
    event.preventDefault();
    this.activeId.set(id);
    // Collapse the mobile "On this page" panel after picking a section.
    (event.target as HTMLElement).closest('details')?.removeAttribute('open');

    const target = this.document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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

  /**
   * Builds the TOC now and rebuilds it whenever the markdown content changes —
   * markdown renders asynchronously, and prev/next navigation reuses this
   * component and swaps the article body for a different post.
   */
  private watchContent(container: HTMLElement): void {
    this.rebuildToc(container);
    if (typeof MutationObserver === 'undefined') return;
    this.contentObserver = new MutationObserver(() => {
      if (this.rebuildTimer) clearTimeout(this.rebuildTimer);
      this.rebuildTimer = setTimeout(() => this.rebuildToc(container), 60);
    });
    // Watch childList/subtree only (not attributes) so assigning heading ids
    // below doesn't retrigger the observer.
    this.contentObserver.observe(container, { childList: true, subtree: true });
  }

  /**
   * Extracts the article's headings into the table of contents. Assigns an id to
   * any heading missing one so anchor links resolve, then wires scroll-spy.
   */
  private rebuildToc(container: HTMLElement): void {
    const headings = Array.from(
      container.querySelectorAll('h2, h3')
    ) as HTMLElement[];

    if (!headings.length) {
      this.observer?.disconnect();
      this.toc.set([]);
      this.activeId.set('');
      return;
    }

    const used = new Set<string>();
    const items = headings.map(heading => {
      let id = heading.id;
      if (!id) {
        const base = this.slugify(heading.textContent ?? '');
        id = base || 'section';
        let n = 1;
        while (used.has(id)) id = `${base}-${n++}`;
        heading.id = id;
      }
      used.add(id);
      return {
        id,
        text: (heading.textContent ?? '').trim(),
        level: heading.tagName === 'H3' ? 3 : 2,
      };
    });

    // Nothing changed (e.g. Prism mutated code tokens) — skip the rewire.
    const current = this.toc();
    const unchanged =
      current.length === items.length &&
      current.every((t, i) => t.id === items[i].id);
    if (unchanged) return;

    this.toc.set(items);
    this.activeId.set(items[0].id);
    this.observeHeadings(headings);
  }

  /** Highlights the heading nearest the top of the viewport as the user scrolls. */
  private observeHeadings(headings: HTMLElement[]): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (!visible.length) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        this.activeId.set((topmost.target as HTMLElement).id);
      },
      { rootMargin: '0px 0px -75% 0px', threshold: 0 }
    );
    headings.forEach(h => this.observer!.observe(h));
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Retrieves post data with next/previous navigation links for the given language
   */
  private getPostWithNavigation(language: string) {
    return combineLatest([
      of(this.getPostsForLanguage(language)),
      this.fetchPostContent(language),
    ]).pipe(
      map(([languagePosts, currentPost]) => {
        // injectContent yields an empty object (no attributes) when the file
        // for this locale+slug doesn't exist — treat that as "not found".
        if (!currentPost?.attributes?.title) {
          this.redirectToLocalizedSlug();
          return null;
        }
        this.redirected = false;
        const sortedPosts = this.getSortedPostsByDate(languagePosts);
        return this.addNavigationLinks(currentPost, sortedPosts);
      })
    );
  }

  /**
   * If the current locale has no post for this slug (e.g. the language was
   * switched to a slug that only exists in the other language), redirect to the
   * translated slug from the source post's `otherSlug`. The base href supplies
   * the active locale prefix.
   */
  private redirectToLocalizedSlug(): void {
    if (this.redirected) return;
    const slug = this.route.snapshot.params['slug'];
    if (!slug) return;

    const source = this.contentFiles.find(
      file => file.attributes.slug === slug || file.slug === slug
    );
    const otherSlug = source?.attributes.otherSlug;
    if (otherSlug && otherSlug !== slug) {
      this.redirected = true;
      this.router.navigate(['/blog', otherSlug]);
    }
  }

  /**
   * Fetches post content for the current slug in the given language
   */
  private fetchPostContent(language: string) {
    return runInInjectionContext(this.injector, () => {
      return injectContent<PostAttributes>({
        param: 'slug',
        subdirectory: language,
      });
    });
  }

  /**
   * Filters content files for the specified language
   */
  private getPostsForLanguage(language: string) {
    return this.contentFiles.filter(
      file => file.filename.split('/')[3] === language
    );
  }

  /**
   * Sorts posts by date (newest first) with normalized date format
   */
  private getSortedPostsByDate(posts: any[]) {
    return posts
      .map(post => ({
        ...post,
        attributes: {
          ...post.attributes,
          date: DateTime.fromFormat(
            post.attributes.date,
            'MM-dd-yyyy'
          ).toISODate()!,
        },
      }))
      .sort(
        (a, b) =>
          DateTime.fromISO(b.attributes.date).toMillis() -
          DateTime.fromISO(a.attributes.date).toMillis()
      );
  }

  /**
   * Adds next/previous navigation links to the post
   */
  private addNavigationLinks(currentPost: any, sortedPosts: any[]) {
    if (!currentPost) return null;

    const postIndex = sortedPosts.findIndex(
      post => post.attributes.slug === currentPost.attributes.slug
    );

    return {
      ...currentPost,
      nextPost: sortedPosts[postIndex - 1]?.slug,
      previousPost: sortedPosts[postIndex + 1]?.slug,
    };
  }
}
