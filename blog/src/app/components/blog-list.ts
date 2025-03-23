import { Component, inject } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { DateTime } from 'luxon';
import { map } from 'rxjs';
import { PostAttributes } from '../models/post.model';
import { TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { BlogCoverComponent } from './blog-cover';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [BlogCoverComponent],
  template: `
    <div
      class="flex flex-col flex-wrap justify-center gap-8 overflow-auto pb-4 pt-4 lg:flex-row lg:gap-6">
      @for (post of posts(); track post.attributes.slug || $index) {
        <app-blog-cover [post]="post" />
      }
    </div>
  `,
})
export class BlogListComponent {
  private readonly contentFiles = injectContentFiles<PostAttributes>();
  private readonly translocoService = inject(TranslocoService);

  posts = toSignal(
    this.translocoService.langChanges$.pipe(
      map(currentLanguage => this.getProcessedPosts(currentLanguage))
    ),
    { initialValue: [] }
  );

  /**
   * Processes content files by filtering, transforming, and sorting posts
   * @param currentLanguage The current selected language
   */
  private getProcessedPosts(currentLanguage: string) {
    const filteredPosts = this.filterPostsByLanguage(
      this.contentFiles,
      currentLanguage
    );
    const transformedPosts = this.transformPosts(filteredPosts);
    return this.sortPostsByDateDescending(transformedPosts);
  }

  /**
   * Filters posts to only include those matching the current language
   */
  private filterPostsByLanguage(posts: Array<any>, language: string) {
    return posts.filter(post => {
      const postLanguage = this.extractLanguageFromPath(post.filename);
      return language === postLanguage;
    });
  }

  /**
   * Extracts language code from the post's file path
   */
  private extractLanguageFromPath(filePath: string): string {
    return filePath.split('/')[3];
  }

  /**
   * Transforms post data to include formatted date and language
   */
  private transformPosts(posts: Array<any>) {
    return posts.map(post => {
      const parsedDate = DateTime.fromFormat(
        post.attributes.date,
        'MM-dd-yyyy'
      );
      const isoDateString = parsedDate.toISODate();
      const language = this.extractLanguageFromPath(post.filename);

      return {
        ...post,
        attributes: {
          ...post.attributes,
          date: isoDateString as string,
          language,
        },
      };
    });
  }

  /**
   * Sorts posts by date in descending order (newest first)
   */
  private sortPostsByDateDescending(posts: Array<any>) {
    return [...posts].sort(
      (a, b) =>
        DateTime.fromISO(b.attributes.date).toMillis() -
        DateTime.fromISO(a.attributes.date).toMillis()
    );
  }

  /**
   * Tracking function for NgFor to improve rendering performance
   */
  trackByPost(index: number, post: { attributes: PostAttributes }): string {
    return post.attributes.slug || String(index);
  }
}
