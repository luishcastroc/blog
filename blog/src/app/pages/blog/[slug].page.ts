import { Component, OnInit, OnDestroy, inject, Injector } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { postMetaResolver, postTitleResolver } from '../../models/resolvers';
import {
  injectContent,
  injectContentFiles,
  MarkdownComponent,
} from '@analogjs/content';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { combineLatest, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { PostAttributes } from '../../models/post.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { NgOptimizedImage } from '@angular/common';
import { runInInjectionContext } from '@angular/core';

export const routeMeta: RouteMeta = {
  title: postTitleResolver,
  meta: postMetaResolver,
};

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    MarkdownComponent,
    RouterLink,
    TranslocoDirective,
    NgOptimizedImage,
  ],
  host: { class: 'px-0' },
  template: `
    <ng-container *transloco="let t; read: 'blog'">
      @let postItem = post();
      @if (postItem) {
        <article
          class="text-primary-content flex w-full flex-auto flex-col items-center gap-4 overflow-auto">
          <section
            class="mb-4 flex w-full flex-auto flex-row justify-between gap-4 lg:w-3/5">
            <button
              [routerLink]="['/blog', postItem.previousPost]"
              [disabled]="!postItem.previousPost"
              class="btn btn-accent w-28"
              type="button"
              attr.aria-label="{{ t('aria-previous') }}">
              {{ t('previous') }}
            </button>
            <button
              [routerLink]="['/blog', postItem.nextPost]"
              [disabled]="!postItem.nextPost"
              class="btn btn-accent w-28"
              type="button"
              attr.aria-label="{{ t('aria-next') }}">
              {{ t('next') }}
            </button>
          </section>
          <img
            [ngSrc]="postItem.attributes.coverImage"
            width="1000"
            height="420"
            priority />
          <h1 class="self-center text-center text-3xl font-extrabold lg:w-3/5">
            {{ postItem.attributes.title }}
          </h1>
          <div
            class="line-numbers blog-post container w-full pb-8 pt-4 md:w-11/12 md:px-0 lg:w-3/5">
            <analog-markdown [content]="postItem.content" />
          </div>
        </article>
      }
    </ng-container>
  `,
})
export default class BlogPostComponent implements OnInit, OnDestroy {
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly destroy$ = new Subject<boolean>();

  private readonly contentFiles = injectContentFiles<PostAttributes>();

  post = toSignal(
    this.transloco.langChanges$.pipe(
      switchMap(language => this.getPostWithNavigation(language)),
      takeUntil(this.destroy$)
    ),
    { initialValue: null }
  );

  ngOnInit(): void {
    this.setupLanguageChangeNavigation();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Sets up navigation when language changes to maintain context
   * between translated versions of the same post
   */
  private setupLanguageChangeNavigation(): void {
    this.transloco.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => {
        const currentRoute = this.router.url;
        const newRoute = this.getRouteForLanguage(currentRoute, language);

        if (newRoute !== currentRoute) {
          this.router.navigate([newRoute]);
        }
      });
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
        const sortedPosts = this.getSortedPostsByDate(languagePosts);
        return this.addNavigationLinks(currentPost, sortedPosts);
      })
    );
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

  /**
   * Converts the current route to its equivalent in the target language
   */
  private getRouteForLanguage(route: string, targetLanguage: string): string {
    const segments = route.split('/');
    const currentSlug = segments[2];

    if (!currentSlug) return route;

    const post = this.contentFiles.find(file => file.slug === currentSlug);
    if (!post) return route;

    const postLanguage = post.filename.split('/')[3];

    // If already in the target language, no change needed
    if (postLanguage === targetLanguage) {
      return route;
    }

    // Use the alternate slug for this post in the target language
    const translatedSlug = post.attributes.otherSlug || currentSlug;
    segments[2] = translatedSlug;

    return segments.join('/');
  }
}
