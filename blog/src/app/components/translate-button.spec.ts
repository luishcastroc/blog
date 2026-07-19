import { describe, expect, it } from 'vitest';

import { getTranslatedPostPath } from './translate-button';

describe('getTranslatedPostPath', () => {
  const posts = [
    {
      slug: 'developer-in-ai-world',
      otherSlug: 'desarrollo-en-el-mundo-ai',
    },
  ];

  it('maps a localized blog URL to its translated slug', () => {
    expect(
      getTranslatedPostPath('/en/blog/developer-in-ai-world', 'es', posts)
    ).toBe('/es/blog/desarrollo-en-el-mundo-ai');
  });

  it('decodes encoded slugs before matching', () => {
    expect(
      getTranslatedPostPath(
        '/en/blog/developer-in-ai-world%20',
        'es',
        posts
      )
    ).toBeNull();
  });

  it('leaves non-post routes to the standard locale switcher', () => {
    expect(getTranslatedPostPath('/en/about', 'es', posts)).toBeNull();
  });
});
