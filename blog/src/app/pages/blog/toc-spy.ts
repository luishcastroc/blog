import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';

import { findActiveHeading, HeadingPosition } from './toc-tracking';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Builds a table of contents from the host element's h2/h3 headings and
 * tracks which section the reader is in.
 *
 * Layout is read only when it actually changes (content rebuilds, resizes,
 * images loading); scroll events just compare scrollY against the cached
 * geometry, so tracking never forces layout while the reader scrolls.
 */
@Directive({
  selector: '[appTocSpy]',
  standalone: true,
  exportAs: 'appTocSpy',
})
export class TocSpyDirective {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly container =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly toc = signal<TocItem[]>([]);
  readonly activeId = signal('');

  private scrollFrame?: number;
  private currentHeadings: HTMLElement[] = [];
  // Document-space geometry cached by measure().
  private headingPositions: HeadingPosition[] = [];
  private articleBottom = 0;
  private viewportHeight = 0;
  // Set while scrollTo() drives a smooth scroll, so the spy doesn't flick
  // through the intermediate sections it passes on the way.
  private suppressSpy = false;
  private suppressTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const teardown = this.setup();
      destroyRef.onDestroy(teardown);
    });
  }

  /**
   * Scrolls to a section, keeping the highlight locked on it until the
   * smooth scroll settles (scrollend, with a timer fallback for browsers
   * without the event).
   */
  scrollTo(id: string): void {
    this.suppressSpy = true;
    this.clearSuppressTimer();
    this.suppressTimer = setTimeout(() => this.releaseSpySuppression(), 1200);
    this.activeId.set(id);
    this.document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Clears the tracking state and rebuilds from the current content. */
  reset(): void {
    this.clearSuppressTimer();
    this.suppressSpy = false;
    this.activeId.set('');
    this.currentHeadings = [];
    this.headingPositions = [];
    afterNextRender(
      { read: () => this.rebuildToc() },
      { injector: this.injector }
    );
  }

  private setup(): () => void {
    this.rebuildToc();

    const win = this.document.defaultView;
    if (!win) return () => undefined;

    const viewportController = new AbortController();
    const { signal: abortSignal } = viewportController;
    let rebuildTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleUpdate = () => {
      if (this.scrollFrame) return;
      this.scrollFrame = win.requestAnimationFrame(() => {
        this.scrollFrame = undefined;
        this.updateActiveHeading();
      });
    };
    const remeasure = () => {
      this.measure();
      this.updateActiveHeading();
    };

    win.addEventListener('scroll', scheduleUpdate, {
      passive: true,
      signal: abortSignal,
    });
    win.addEventListener('resize', remeasure, { signal: abortSignal });
    // Releases the scrollTo() lock once the smooth scroll settles.
    win.addEventListener('scrollend', () => this.releaseSpySuppression(), {
      signal: abortSignal,
    });

    // Re-measure when the article's size changes without a rebuild: images
    // and fonts loading, embeds expanding, viewport width changes.
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(() => remeasure());
    resizeObserver?.observe(this.container);

    const contentObserver =
      typeof MutationObserver === 'undefined'
        ? undefined
        : new MutationObserver(() => {
            if (rebuildTimer) clearTimeout(rebuildTimer);
            rebuildTimer = setTimeout(() => this.rebuildToc(), 60);
          });

    // Ignore attribute changes so assigning heading ids does not retrigger it.
    contentObserver?.observe(this.container, {
      childList: true,
      subtree: true,
    });

    return () => {
      contentObserver?.disconnect();
      resizeObserver?.disconnect();
      viewportController.abort();
      this.clearSuppressTimer();
      if (rebuildTimer) clearTimeout(rebuildTimer);
      if (this.scrollFrame) {
        win.cancelAnimationFrame(this.scrollFrame);
        this.scrollFrame = undefined;
      }
    };
  }

  /**
   * Extracts the content's headings into the table of contents. Assigns an id
   * to any heading missing one so anchor links resolve, then re-measures.
   */
  private rebuildToc(): void {
    const headings = Array.from(
      this.container.querySelectorAll('h2, h3')
    ) as HTMLElement[];

    if (!headings.length) {
      this.currentHeadings = [];
      this.headingPositions = [];
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

    this.currentHeadings = headings;
    this.toc.set(items);
    this.measure();
    this.updateActiveHeading();
  }

  /**
   * Caches document-space positions for the headings and the article bottom.
   * This is the only place that reads layout; scroll updates then work purely
   * off scrollY. Runs on rebuild, viewport resize, and article size changes.
   */
  private measure(): void {
    const win = this.document.defaultView;
    if (!win) return;

    const scrollY = win.scrollY;
    this.viewportHeight = win.innerHeight;
    this.headingPositions = this.currentHeadings.map(heading => ({
      id: heading.id,
      top: heading.getBoundingClientRect().top + scrollY,
    }));
    this.articleBottom =
      this.container.getBoundingClientRect().bottom + scrollY;
  }

  private updateActiveHeading(): void {
    const win = this.document.defaultView;
    if (!win || this.suppressSpy || !this.headingPositions.length) return;

    this.activeId.set(
      findActiveHeading(
        this.headingPositions,
        win.scrollY,
        this.viewportHeight,
        this.articleBottom
      )
    );
  }

  private releaseSpySuppression(): void {
    this.clearSuppressTimer();
    if (!this.suppressSpy) return;
    this.suppressSpy = false;
    this.updateActiveHeading();
  }

  private clearSuppressTimer(): void {
    if (this.suppressTimer) {
      clearTimeout(this.suppressTimer);
      this.suppressTimer = undefined;
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
