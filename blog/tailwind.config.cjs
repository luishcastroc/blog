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
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        'mr-robot-dark': {
          primary: '#00ff41',
          'primary-focus': '#00cc34',
          'primary-content': '#000000',
          secondary: '#ff073a',
          'secondary-focus': '#cc0530',
          'secondary-content': '#ffffff',
          accent: '#1e90ff',
          'accent-focus': '#1976d2',
          'accent-content': '#ffffff',
          neutral: '#1a1a1a',
          'neutral-focus': '#2d2d30',
          'neutral-content': '#ffffff',
          'base-100': '#0a0a0a',
          'base-200': '#1a1a1a',
          'base-300': '#2d2d30',
          'base-content': '#ffffff',
          info: '#3abff8',
          success: '#00ff41',
          warning: '#fbbd23',
          error: '#ff073a',
        },
      },
      {
        'mr-robot-light': {
          primary: '#1a1a1a',
          'primary-focus': '#2d2d30',
          'primary-content': '#f5f5f5',
          secondary: '#ff073a',
          'secondary-focus': '#cc0530',
          'secondary-content': '#ffffff',
          accent: '#1e90ff',
          'accent-focus': '#1976d2',
          'accent-content': '#ffffff',
          neutral: '#e0e0e0',
          'neutral-focus': '#d0d0d0',
          'neutral-content': '#1a1a1a',
          'base-100': '#f8f8f8',
          'base-200': '#e8e8e8',
          'base-300': '#d8d8d8',
          'base-content': '#1a1a1a',
          info: '#3abff8',
          success: '#00ff41',
          warning: '#fbbd23',
          error: '#ff073a',
        },
      },
    ],
  },
};
