# Styles Architecture

This project uses a modular SCSS architecture for better maintainability and organization.

## Directory Structure

```
src/assets/styles/
├── main.scss                 # Main entry point
├── base/
│   ├── _variables.scss       # CSS custom properties and variables
│   ├── _reset.scss          # Base HTML/body reset and scrollbar
│   └── _typography.scss     # Typography utilities and font styles
├── components/
│   ├── _buttons.scss        # Terminal-style button components
│   ├── _forms.scss          # Form styling (inputs, textareas)
│   ├── _navigation.scss     # Navbar and dropdown menu styles
│   └── _blog.scss           # Blog post and content styling
├── layouts/
│   ├── _header.scss         # Header and navigation layout
│   └── _content.scss        # Main content area layout
├── themes/
│   ├── _mr-robot.scss       # Mr. Robot theme colors and effects
│   └── _animations.scss     # All keyframe animations
└── utilities/
    ├── _terminal.scss       # Terminal-specific utility classes
    ├── _effects.scss        # Visual effects (glitch, cyberpunk, etc.)
    └── _responsive.scss     # Responsive utilities and breakpoints
```

## How to Add New Styles

1. **Components**: Add new component styles to the `components/` directory
2. **Utilities**: Add utility classes to the `utilities/` directory
3. **Themes**: Add theme-specific styles to the `themes/` directory
4. **Layouts**: Add layout-specific styles to the `layouts/` directory

## File Naming Convention

- Use underscore prefix for partials: `_filename.scss`
- Use descriptive names that match the content purpose
- Keep files focused on a single responsibility

## Import Order

The main.scss file imports in this order:

1. External dependencies (Tailwind, libraries)
2. Base styles (variables, reset, typography)
3. Components (buttons, forms, navigation)
4. Layouts (header, content)
5. Themes (colors, animations)
6. Utilities (helpers, effects, responsive)

## Benefits

- **Maintainability**: Easy to find and modify specific styles
- **Debugging**: Smaller files make debugging much easier
- **Team Collaboration**: Multiple developers can work on different files
- **Performance**: Better caching and build optimization
- **Organization**: Logical separation of concerns
