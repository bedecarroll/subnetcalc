# Web Template Guide

## Overview

This is a comprehensive template for creating static websites with modern styling and minimal JavaScript functionality. It features a clean, monospace design with dark/light theme support, TypeScript compilation, and modular architecture. The template has been cleaned of domain-specific functionality and provides generic patterns for building any type of web application.

## Design Philosophy

This template follows these core principles:

1. **Minimal Dependencies**: Only essential dependencies (TypeScript for development)
2. **Static First**: Pure client-side application, no server required
3. **Progressive Enhancement**: Works without JavaScript, enhanced with it
4. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
5. **Responsive**: Works on desktop and mobile
6. **Brutalist Aesthetic**: Bold borders, monospace fonts, high contrast

## Template Features

### Visual Design
- **Typography**: Courier New monospace font throughout
- **Color Scheme**: High contrast black/white with bright accent colors
- **Layout**: Centered container with bold black borders
- **Theme Support**: Light/dark mode toggle with localStorage persistence
- **Responsive**: Mobile-first design with media queries

### Functionality
- **TypeScript**: Compiled to ES2020 with source maps
- **Modular Architecture**: Separate classes for different concerns
- **Local Storage**: Persistent user preferences
- **Copy to Clipboard**: Built-in copy functionality
- **Autocomplete**: Reusable dropdown component
- **Accessibility**: Full ARIA support and keyboard navigation

### Technical Stack
- **HTML5**: Semantic markup with ARIA attributes
- **CSS3**: Custom properties, flexbox, grid, media queries
- **TypeScript**: Strict mode, ES modules
- **Build System**: Native TypeScript compiler

## File Structure Breakdown

```
web-template/
├── index.html              # Main HTML file with template placeholders
├── styles.css              # Complete styling system
├── src/                    # TypeScript source files
│   ├── main.ts            # Application entry point and UI logic
│   ├── autocomplete.ts    # Reusable autocomplete component
│   └── utils.ts           # Generic utility functions
├── package.json           # Build scripts and metadata
├── tsconfig.json          # TypeScript configuration
├── LICENSE                # MIT license
├── README.md              # Basic usage instructions
├── AGENTS.md              # LLM agent guidance
└── TEMPLATE_GUIDE.md      # This comprehensive guide
```

## Customization Guide

### 1. Project Setup
Replace these placeholders in your new project:

**package.json**
```json
{
  "name": "{{projectSlug}}",        // e.g., "my-awesome-tool"
  "description": "{{projectDescription}}"  // e.g., "A tool for awesome things"
}
```

**index.html**
```html
<title>{{projectTitle}}</title>     <!-- e.g., "My Awesome Tool" -->
<h1>{{projectTitle}}</h1>
<p>{{projectDescription}}</p>
```

### 2. Content Customization

**Header Section** (`index.html` lines 11-18):
- Update title and description
- Adjust ARIA labels and help text

**Main Content** (`index.html` lines 20-52):
- Replace input sections with your UI components
- Update form labels and placeholders
- Modify button text and functionality
- Adjust ARIA attributes for your content

**External Scripts** (`index.html` lines 55-56):
- Add external libraries as needed
- Update the main.js import path if needed

### 3. Styling System

The CSS is organized into logical sections:

**Base Styles** (lines 1-50):
```css
* { box-sizing: border-box; }
body { font-family: 'Courier New', Courier, monospace; }
.container { max-width: 900px; border: 4px solid #000; }
```

**Component Styles**:
- Input fields: Consistent border and padding
- Buttons: Hover states and focus management
- Layout: Flexbox and responsive design

**Theme System** (lines 296-337):
```css
body.dark { background: #000; color: #fff; }
body.dark .container { border-color: #fff; }
```

### 4. JavaScript Architecture

**main.ts Structure**:
```typescript
class App {
  // DOM element references
  private inputElement: HTMLInputElement;
  
  constructor() {
    // Initialize DOM references
    // Set up event listeners
    // Load saved preferences
  }
  
  private bindEvents(): void {
    // Event handling logic
  }
  
  private loadFromStorage(): void {
    // localStorage management
  }
}
```

**Key Patterns**:
- Class-based organization
- Private methods for internal logic
- Event delegation for dynamic content
- localStorage for persistence
- ARIA state management

## Development Workflow

### Initial Setup
```bash
# 1. Copy template directory
cp -r web-template my-new-project
cd my-new-project

# 2. Install dependencies
npm install

# 3. Start development
npm run dev  # Watches TypeScript files
```

### Build Process
```bash
npm run build
# Creates:
# - dist/ (compiled JavaScript)
# - public/ (deployable website)
```

### Serving Locally
```bash
# Option 1: Node.js (requires 'serve' package)
npm run serve

# Option 2: Python
npm run serve:python

# Then open http://localhost:8000
```

## Styling Conventions

### Color Palette
```css
/* Primary colors */
--text-color: #000;
--bg-color: #fff;
--border-color: #000;

/* Dark theme */
--dark-text: #fff;
--dark-bg: #000;
--dark-accent: #333;

/* Accent colors for tags/components */
--red: #ff8a80;
--indigo: #8c9eff;
--blue: #80d8ff;
--teal: #a7ffeb;
--green: #ccff90;
--yellow: #ffff8d;
--orange: #ffd180;
--peach: #ff9e80;
```

### Component Patterns

**Interactive Elements**:
```css
.interactive-element {
  border: 4px solid #000;
  padding: 10px;
  background: transparent;
  cursor: pointer;
  transition: none; /* Instant state changes */
}

.interactive-element:hover {
  background: #000;
  color: #fff;
}
```

**Container Pattern**:
```css
.container {
  max-width: 900px;
  margin: 40px auto;
  border: 4px solid #000;
  padding: 20px;
}
```

### Typography Scale
- Headers: 2rem (h1), 1.2rem (h3)
- Body: 1rem
- Small text: 0.9rem
- Tiny text: 0.7rem (timeline labels)

## Accessibility Features

### ARIA Implementation
- `role` attributes for custom components
- `aria-label` for interactive elements
- `aria-expanded` for dropdown states
- `aria-describedby` for help text
- `aria-checked` for toggle buttons

### Keyboard Navigation
- Tab order management
- Enter/Space activation
- Arrow key navigation in dropdowns
- Escape key dismissal

### Screen Reader Support
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

## Responsive Design

### Breakpoints
```css
@media (max-width: 600px) {
  .container {
    margin: 20px;
    padding: 15px;
  }
  
  header h1 {
    font-size: 1.5rem;
  }
}
```

### Mobile Considerations
- Touch-friendly button sizes (minimum 44px)
- Readable font sizes on small screens
- Simplified layouts on mobile
- Proper viewport meta tag

## Component Library

### Reusable Components

**AutocompleteInput** (`src/autocomplete.ts`):
- Dropdown positioning
- Keyboard navigation  
- Selection callbacks
- Filtering logic

**Utils** (`src/utils.ts`):
- Generic input processing
- Format conversion functions
- Common utility methods
- Type definitions

**Theme Toggle**:
- localStorage persistence
- Icon state management
- Body class toggling

**Copy Button Pattern**:
- Clipboard API integration
- Visual feedback
- Error handling

## Best Practices

### Code Organization
1. **Separation of Concerns**: HTML structure, CSS styling, TypeScript logic
2. **Module Pattern**: Each TypeScript file has a single responsibility
3. **Event Delegation**: Attach listeners to parent elements when possible
4. **Error Handling**: Graceful fallbacks for all functionality

### Performance
1. **Minimal DOM Manipulation**: Batch updates when possible
2. **Event Throttling**: For high-frequency events like input
3. **Lazy Loading**: Initialize components only when needed
4. **CSS Efficiency**: Avoid expensive selectors and properties

### Maintenance
1. **Consistent Naming**: Use descriptive class and variable names
2. **Documentation**: Comment complex logic
3. **Version Control**: Meaningful commit messages
4. **Testing**: Manual testing across browsers and devices

## Extension Points

### Adding New Features
1. Create new TypeScript files in `src/`
2. Import and initialize in `main.ts`
3. Add corresponding HTML elements
4. Style with consistent CSS patterns

### Customizing Appearance
1. Modify CSS custom properties
2. Update color arrays in TypeScript
3. Adjust spacing and sizing variables
4. Test in both light and dark themes

### Integration Tips
1. **External APIs**: Use fetch() with proper error handling
2. **Additional Libraries**: Load via CDN or bundle appropriately
3. **Local Storage**: Follow existing patterns for persistence
4. **Accessibility**: Maintain ARIA compliance

This template provides a solid foundation for building modern, accessible, and maintainable static websites. The brutalist design aesthetic and TypeScript architecture make it suitable for tools, utilities, and content sites that need to convey reliability and functionality.