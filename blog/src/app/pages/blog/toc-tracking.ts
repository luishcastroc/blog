export interface HeadingPosition {
  id: string;
  /** Distance from the top of the document, in px (rect.top + scrollY). */
  top: number;
}

/**
 * Resolves which heading the reader is currently in from a scroll position.
 *
 * Each heading gets an activation point: the scroll position where its top
 * edge crosses a line `offset` px below the viewport top. Headings near the
 * end of the article may sit too low to ever reach that line, so every
 * activation point is capped to leave at least `offset` px of scroll range
 * per remaining section — short final sections still get their own turn
 * before the reader runs out of scroll. The mapping from scroll position to
 * heading is monotone, so the highlight never flip-flops between sections.
 *
 * `articleBottom` is the document-space bottom of the article content, which
 * keeps the tracking independent of whatever follows it (footer, comments).
 */
export function findActiveHeading(
  headings: readonly HeadingPosition[],
  scrollY: number,
  viewportHeight: number,
  articleBottom: number,
  offset = 140
): string {
  if (!headings.length) return '';

  const maxScroll = Math.max(articleBottom - viewportHeight, 0);

  // The end of the article is in view: the reader finished the content, so
  // the last section is active regardless of where its heading sits.
  if (scrollY >= maxScroll - 2) {
    return headings[headings.length - 1].id;
  }

  const lastIndex = headings.length - 1;
  let active = headings[0].id;
  for (let i = 0; i <= lastIndex; i++) {
    const cap = maxScroll - (lastIndex - i) * offset;
    const activateAt = Math.min(headings[i].top - offset, cap);
    if (activateAt > scrollY) break;
    active = headings[i].id;
  }
  return active;
}
