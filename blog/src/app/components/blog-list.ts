import { Component, signal } from '@angular/core';

import { DateTime } from 'luxon';

import { injectContentFiles } from '@analogjs/content';
import { injectLocale } from '@analogjs/router/tokens';

import { PostAttributes } from '../models/post.model';
import { BlogCoverComponent } from './blog-cover';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [BlogCoverComponent],
  host: { class: 'w-full' },
  template: `
    <div
      class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      @for (post of posts(); track post.attributes.slug || $index) {
        <app-blog-cover [post]="post" />
      }
    </div>
  `,
})
export class BlogListComponent {
  private readonly contentFiles = injectContentFiles<PostAttributes>();
  // Active locale comes from the URL prefix (defaults to 'en').
  private readonly locale = injectLocale() ?? 'en';

  posts = signal(this.getProcessedPosts(this.locale));

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
