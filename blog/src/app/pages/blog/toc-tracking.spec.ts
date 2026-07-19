import { describe, expect, it } from 'vitest';

import { findActiveHeading } from './toc-tracking';

// Viewport of 800px, article ending at 3000px → 2200px of scrollable range.
const viewport = 800;
const articleBottom = 3000;

const headings = [
  { id: 'introduction', top: 200 },
  { id: 'examples', top: 900 },
  { id: 'conclusion', top: 1700 },
];

describe('findActiveHeading', () => {
  it('returns nothing without headings', () => {
    expect(findActiveHeading([], 0, viewport, articleBottom)).toBe('');
  });

  it('starts on the first heading before any section is reached', () => {
    expect(findActiveHeading(headings, 0, viewport, articleBottom)).toBe(
      'introduction'
    );
  });

  it('tracks the last heading above the reading marker', () => {
    expect(findActiveHeading(headings, 800, viewport, articleBottom)).toBe(
      'examples'
    );
  });

  it('activates a heading once it crosses the reading marker', () => {
    expect(findActiveHeading(headings, 1560, viewport, articleBottom)).toBe(
      'conclusion'
    );
  });

  it('marks the final heading at the bottom of the article', () => {
    expect(findActiveHeading(headings, 2200, viewport, articleBottom)).toBe(
      'conclusion'
    );
  });

  it('is unaffected by content below the article', () => {
    // A tall footer only grows the page, not articleBottom, so the last
    // heading still wins as soon as the article end is in view.
    expect(findActiveHeading(headings, 1400, viewport, 2200)).toBe(
      'conclusion'
    );
  });

  it('marks the final heading when the whole article fits the viewport', () => {
    expect(findActiveHeading(headings, 0, viewport, 700)).toBe('conclusion');
  });

  it('gives short final sections their own scroll range', () => {
    // The last two headings sit so close to the article end that they can
    // never cross the 140px reading marker; their activation points get
    // compressed into the final stretch of scroll instead of being skipped.
    const tail = [
      { id: 'introduction', top: 200 },
      { id: 'closing', top: 2600 },
      { id: 'thanks', top: 2800 },
    ];
    expect(findActiveHeading(tail, 1000, viewport, articleBottom)).toBe(
      'introduction'
    );
    expect(findActiveHeading(tail, 2100, viewport, articleBottom)).toBe(
      'closing'
    );
    expect(findActiveHeading(tail, 2200, viewport, articleBottom)).toBe(
      'thanks'
    );
  });

  it('never moves backwards as the reader scrolls down', () => {
    const tail = [
      { id: 'a', top: 200 },
      { id: 'b', top: 2500 },
      { id: 'c', top: 2700 },
      { id: 'd', top: 2900 },
    ];
    let previousIndex = -1;
    for (let scrollY = 0; scrollY <= 2200; scrollY += 10) {
      const id = findActiveHeading(tail, scrollY, viewport, articleBottom);
      const index = tail.findIndex(h => h.id === id);
      expect(index).toBeGreaterThanOrEqual(previousIndex);
      previousIndex = index;
    }
    expect(previousIndex).toBe(tail.length - 1);
  });
});
