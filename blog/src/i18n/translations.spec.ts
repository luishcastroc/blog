import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

import en from './en.json';
import es from './es.json';

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return ['.ts', '.html'].includes(extname(entry.name)) ? [path] : [];
  });
}

describe('translation catalogs', () => {
  it('keeps English and Spanish message IDs in sync', () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });

  it('does not contain blank translations', () => {
    expect(Object.values(en).every(value => value.trim().length > 0)).toBe(true);
    expect(Object.values(es).every(value => value.trim().length > 0)).toBe(true);
  });

  it('contains every explicit message ID used by application templates', () => {
    const ids = sourceFiles(join(process.cwd(), 'blog', 'src', 'app')).flatMap(
      file => {
      const source = readFileSync(file, 'utf8');
      return [...source.matchAll(/i18n(?:-[\w-]+)?="@@([^"]+)"/g)].map(
        match => match[1]
      );
      }
    );

    expect(ids.length).toBeGreaterThan(0);
    expect(ids.filter(id => !(id in en))).toEqual([]);
    expect(ids.filter(id => !(id in es))).toEqual([]);
  });
});
