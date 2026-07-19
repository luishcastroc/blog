const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html,analog}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      // Neobrutalism tokens — resolve to CSS vars so they follow the theme.
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        ash: 'var(--ash)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        red: 'var(--red)',
        'red-ink': 'var(--red-ink)',
        link: 'var(--link)',
        'on-red': 'var(--on-red)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Courier New', 'monospace'],
      },
      borderWidth: {
        3: '3px',
      },
      boxShadow: {
        nb: '4px 4px 0 0 var(--ink)',
        'nb-sm': '2px 2px 0 0 var(--ink)',
        'nb-lg': '6px 6px 0 0 var(--ink)',
        'nb-red': '4px 4px 0 0 var(--red)',
      },
      borderRadius: {
        none: '0',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        'mr-robot-light': {
          primary: '#ff073a',
          'primary-content': '#ffffff',
          secondary: '#111111',
          'secondary-content': '#f5f2ea',
          accent: '#0b4fd8',
          'accent-content': '#ffffff',
          neutral: '#111111',
          'neutral-content': '#f5f2ea',
          'base-100': '#f5f2ea',
          'base-200': '#e4e0d5',
          'base-300': '#d6d1c2',
          'base-content': '#111111',
          info: '#0b4fd8',
          success: '#0f9d58',
          warning: '#f4b400',
          error: '#ff073a',
        },
      },
      {
        'mr-robot-dark': {
          primary: '#ff2d55',
          'primary-content': '#111111',
          secondary: '#f5f2ea',
          'secondary-content': '#16150f',
          accent: '#7fa6ff',
          'accent-content': '#111111',
          neutral: '#f5f2ea',
          'neutral-content': '#16150f',
          'base-100': '#16150f',
          'base-200': '#232019',
          'base-300': '#2e2a20',
          'base-content': '#f5f2ea',
          info: '#7fa6ff',
          success: '#3ddc84',
          warning: '#f4b400',
          error: '#ff2d55',
        },
      },
    ],
  },
};
