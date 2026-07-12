# Style Guide

## Design System

This template implements a **brutalist** design system with the following characteristics:

### Core Principles
1. **High Contrast**: Pure black on white (or white on black in dark mode)
2. **Bold Borders**: 4px solid borders on all major elements
3. **Monospace Typography**: Courier New throughout for technical feel
4. **No Animations**: Instant state changes, no transitions
5. **Functional First**: Every element serves a clear purpose

## Typography

### Font Stack
```css
font-family: 'Courier New', Courier, monospace;
```

### Font Sizes
```css
/* Headers */
.main-title { font-size: 2rem; }        /* 32px */
.section-title { font-size: 1.2rem; }   /* 19px */

/* Body Text */
.body-text { font-size: 1rem; }          /* 16px */
.small-text { font-size: 0.9rem; }       /* 14px */
.micro-text { font-size: 0.7rem; }       /* 11px */
```

### Text Styles
- **Bold**: Only for labels and section headers
- **Normal**: All body text and interactive elements
- **No Italic**: Maintains clean, technical appearance

## Color System

### Primary Colors
```css
:root {
  /* Light Mode */
  --color-text: #000;
  --color-background: #fff;
  --color-border: #000;
  
  /* Dark Mode */
  --color-text-dark: #fff;
  --color-background-dark: #000;
  --color-accent-dark: #333;
}
```

### Accent Colors
Used for visual differentiation (tags, highlights):
```css
--red: #ff8a80;      /* Coral red */
--indigo: #8c9eff;   /* Bright indigo */
--blue: #80d8ff;     /* Sky blue */
--teal: #a7ffeb;     /* Mint teal */
--green: #ccff90;    /* Lime green */
--yellow: #ffff8d;   /* Bright yellow */
--orange: #ffd180;   /* Peach orange */
--peach: #ff9e80;    /* Salmon */
```

### Color Usage Rules
1. **Text**: Only pure black (#000) or white (#fff)
2. **Backgrounds**: Only pure white (#fff) or black (#000)
3. **Borders**: Match text color (black or white)
4. **Accents**: Use bright colors sparingly for tags or highlights
5. **Never**: Use gray, gradients, or transparency

## Layout System

### Container Pattern
```css
.container {
  max-width: 900px;     /* Wide enough for content */
  margin: 40px auto;    /* Centered with generous margins */
  border: 4px solid #000; /* Bold border */
  padding: 20px;        /* Internal spacing */
}
```

### Spacing Scale
```css
/* Micro: 5px - between related elements */
.spacing-micro { margin: 5px; }

/* Small: 10px - standard padding, small gaps */
.spacing-small { margin: 10px; }

/* Medium: 20px - section spacing, large padding */
.spacing-medium { margin: 20px; }

/* Large: 40px - major section breaks */
.spacing-large { margin: 40px; }
```

### Grid System
Uses CSS Flexbox for layouts:
```css
/* Horizontal layouts */
.flex-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Vertical layouts */
.flex-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Responsive wrapping */
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
```

## Component Styles

### Buttons
```css
.button {
  /* Base styles */
  border: 4px solid #000;
  padding: 10px;
  background: transparent;
  color: #000;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  
  /* No rounded corners, no shadows */
  border-radius: 0;
  box-shadow: none;
}

.button:hover {
  background: #000;
  color: #fff;
}

/* Primary button variant */
.button-primary {
  background: #000;
  color: #fff;
}

.button-primary:hover {
  background: transparent;
  color: #000;
}
```

### Form Elements
```css
.input {
  width: 100%;
  border: 4px solid #000;
  padding: 10px;
  font-size: 1rem;
  background: transparent;
  color: #000;
  font-family: inherit;
  
  /* Remove default styling */
  border-radius: 0;
  outline: none;
  box-shadow: none;
}

.input:focus {
  /* Maintain border, no glow effects */
  border-color: #000;
}
```

### Labels
```css
.label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1rem;
}
```

### Tags/Badges
```css
.tag {
  display: inline-block;
  border: 4px solid #000;
  padding: 6px 10px;
  margin: 2px;
  font-size: 0.9rem;
  background: var(--accent-color); /* Use accent colors */
  color: #000; /* Always black text on colored background */
  cursor: pointer;
}

.tag:hover {
  background: #000 !important;
  color: #fff !important;
}
```

## Theme Implementation

### Light Theme (Default)
```css
body {
  background: #fff;
  color: #000;
}

.container,
.input,
.button {
  border-color: #000;
  background: transparent;
  color: #000;
}
```

### Dark Theme
```css
body.dark {
  background: #000;
  color: #fff;
}

body.dark .container,
body.dark .input,
body.dark .button {
  border-color: #fff;
  background: #333; /* Slight contrast for inputs */
  color: #fff;
}

body.dark .button:hover {
  background: #fff;
  color: #000;
}
```

### Theme Toggle Implementation
```css
.theme-toggle {
  width: auto;
  margin-left: 10px;
  border: 2px solid #000; /* Thinner border for small button */
  padding: 2px 6px;
  font-size: 0.8rem;
}
```

## Responsive Design

### Mobile-First Approach
```css
/* Mobile styles (default) */
.container {
  margin: 20px;
  padding: 15px;
}

/* Desktop styles */
@media (min-width: 601px) {
  .container {
    margin: 40px auto;
    padding: 20px;
  }
}
```

### Touch Targets
```css
/* Minimum 44px touch targets for mobile */
.button,
.input,
.tag {
  min-height: 44px;
  padding: 10px;
}
```

## Accessibility Guidelines

### Focus States
```css
.button:focus,
.input:focus {
  /* Use browser default focus outline */
  outline: 2px solid #000;
  outline-offset: 2px;
}

body.dark .button:focus,
body.dark .input:focus {
  outline-color: #fff;
}
```

### Screen Reader Content
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### ARIA States
```css
/* Visual indication of ARIA states */
[aria-expanded="true"] .dropdown-icon {
  transform: rotate(180deg);
}

[aria-checked="true"] {
  background: #000;
  color: #fff;
}
```

## Animation Policy

### No Animations
This design system explicitly avoids:
- CSS transitions
- CSS animations
- Transform animations
- Opacity fades
- Easing functions

### Instant State Changes
All interactive states change immediately:
```css
.button:hover {
  /* Instant color change, no transition */
  background: #000;
  color: #fff;
}
```

## Code Style Guidelines

### CSS Organization
1. **Variables first**: Custom properties at the top
2. **Base styles**: Reset and body styles
3. **Layout**: Container and grid systems
4. **Components**: Organized by component type
5. **Utilities**: Helper classes
6. **Media queries**: At the end

### Naming Conventions
```css
/* Component-based naming */
.component-name { }
.component-name__element { }
.component-name--modifier { }

/* State classes */
.is-active { }
.is-hidden { }
.is-selected { }

/* Utility classes */
.u-text-center { }
.u-margin-large { }
.u-sr-only { }
```

### CSS Property Order
1. **Position**: position, top, right, bottom, left, z-index
2. **Box Model**: display, flex, width, height, margin, padding
3. **Border**: border, border-radius
4. **Background**: background, background-color
5. **Typography**: font, color, text-align
6. **Other**: cursor, overflow, opacity

## Usage Examples

### Creating a New Component
```css
.my-component {
  /* Follow the container pattern */
  border: 4px solid #000;
  padding: 20px;
  margin-bottom: 20px;
  background: transparent;
}

.my-component__title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.my-component__content {
  font-size: 1rem;
  line-height: 1.4;
}

/* Dark theme support */
body.dark .my-component {
  border-color: #fff;
}
```

### Interactive Element Pattern
```css
.interactive-element {
  border: 4px solid #000;
  padding: 10px;
  background: transparent;
  color: #000;
  cursor: pointer;
  font-family: inherit;
}

.interactive-element:hover {
  background: #000;
  color: #fff;
}

.interactive-element:focus {
  outline: 2px solid #000;
  outline-offset: 2px;
}

/* Dark theme */
body.dark .interactive-element {
  border-color: #fff;
  color: #fff;
}

body.dark .interactive-element:hover {
  background: #fff;
  color: #000;
}
```

This style guide ensures consistency across all components and maintains the distinctive brutalist aesthetic that makes this template unique and memorable.