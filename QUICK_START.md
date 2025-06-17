# Quick Start Guide

## Template Setup Checklist

Follow this checklist to quickly set up a new project using this template:

### ✅ Step 1: Copy and Initialize
```bash
# Copy the template directory
cp -r web-template my-new-project
cd my-new-project

# Install dependencies
npm install
```

### ✅ Step 2: Update Project Information

**Replace in `package.json`:**
```json
{
  "name": "{{projectSlug}}",           → "my-awesome-tool"
  "description": "{{projectDescription}}" → "A tool for doing awesome things"
}
```

**Replace in `index.html`:**
```html
<title>{{projectTitle}}</title>       → <title>My Awesome Tool</title>
<h1>{{projectTitle}}</h1>             → <h1>My Awesome Tool</h1>
<p>{{projectDescription}}</p>         → <p>A tool for doing awesome things</p>
```

### ✅ Step 3: Customize Content

**HTML Structure** (`index.html`):
- [ ] Update header content (lines 11-19)
- [ ] Modify main content area (lines 21-55)
- [ ] Replace or remove example functionality
- [ ] Update ARIA labels and help text
- [ ] Change external CDN links if needed (line 58)

**CSS Styling** (`styles.css`):
- [ ] Adjust container max-width if needed (line 14)
- [ ] Modify color palette (lines 28-37 in main.ts)
- [ ] Update spacing/sizing if required
- [ ] Customize component styles

**TypeScript Logic** (`src/` directory):
- [ ] Customize `utils.ts` with your processing logic
- [ ] Update `main.ts` with your application code
- [ ] Keep `autocomplete.ts` if you need dropdown functionality
- [ ] Update imports and class names

### ✅ Step 4: Build and Test

```bash
# Compile TypeScript and build site
npm run build

# Serve locally to test
npm run serve
# OR
npm run serve:python

# Open http://localhost:8000 (or :3000 for serve)
```

### ✅ Step 5: Deploy

The `public/` directory contains your complete website:
```
public/
├── index.html      # Your customized HTML
├── styles.css      # Complete CSS system
└── dist/          # Compiled JavaScript
    ├── main.js
    ├── autocomplete.js
    └── dateTimeConverter.js (or your files)
```

Upload the `public/` directory to any static hosting service.

## Common Customizations

### Change Color Scheme

**In TypeScript** (`src/main.ts`):
```typescript
const TAG_COLORS: string[] = [
  '#your-color-1',
  '#your-color-2',
  // ... add more colors
];
```

**In CSS** (`styles.css`):
```css
/* Update hover states, accents, etc. */
.your-component {
  background: #your-brand-color;
}
```

### Add New Components

1. **Create TypeScript class**:
```typescript
// src/myComponent.ts
export class MyComponent {
  constructor(private container: HTMLElement) {
    this.render();
    this.bindEvents();
  }
  
  private render(): void {
    // Component HTML generation
  }
  
  private bindEvents(): void {
    // Event listeners
  }
}
```

2. **Add HTML structure**:
```html
<div id="my-component" class="my-component">
  <!-- Your component markup -->
</div>
```

3. **Style the component**:
```css
.my-component {
  border: 4px solid #000;
  padding: 20px;
  margin-bottom: 20px;
}

body.dark .my-component {
  border-color: #fff;
}
```

4. **Initialize in main.ts**:
```typescript
import { MyComponent } from './myComponent.js';

// In constructor:
new MyComponent(document.getElementById('my-component')!);
```

### Customize Example Functionality

The template includes generic patterns you can customize:

1. **Update processing logic** (`src/utils.ts`):
   - Modify `processInput()` function
   - Update format types and options
   - Add your business logic

2. **Customize UI** (`src/main.ts`):
   - Update component names and labels
   - Modify processing workflows
   - Keep theme toggle and accessibility patterns

3. **Update HTML** (`index.html`):
   - Change input labels and placeholders
   - Update button text and functionality
   - Adjust ARIA attributes for your use case

4. **Rebuild after changes**:
   ```bash
   npm run build
   ```

## Development Tips

### File Watching
```bash
# Watch TypeScript files during development
npm run dev

# In another terminal, serve the site
npm run serve
```

### Debugging
- Use browser dev tools with source maps enabled
- TypeScript files are mapped to original sources
- Console errors will show TypeScript line numbers

### Browser Support
- Modern browsers (ES2020+ support)
- Chrome, Firefox, Safari, Edge (recent versions)
- Mobile browsers with JavaScript enabled

## Project Structure After Customization

```
my-new-project/
├── index.html              # Your customized main page
├── styles.css              # Styling system (mostly unchanged)
├── src/                    # Your TypeScript source
│   ├── main.ts            # Your main application logic
│   ├── autocomplete.ts    # Keep if using dropdowns
│   └── utils.ts           # Your utility functions
├── dist/                   # Compiled JavaScript (generated)
├── public/                 # Built website (generated)
├── package.json           # Your project metadata
├── tsconfig.json          # TypeScript config (usually unchanged)
├── TEMPLATE_GUIDE.md      # Keep for reference
├── STYLE_GUIDE.md         # Keep for reference
├── QUICK_START.md         # This file
├── AGENTS.md              # Keep for LLM guidance
├── README.md              # Update with your project info
└── LICENSE                # Update copyright if needed
```

## Deployment Options

### Static Hosting Services
- **Netlify**: Drag and drop `public/` folder
- **Vercel**: Connect Git repo or upload `public/`
- **GitHub Pages**: Upload `public/` contents to gh-pages branch
- **Surge.sh**: `surge public/` from command line

### CDN Deployment
```bash
# Example with Surge
npm install -g surge
npm run build
surge public/ your-domain.surge.sh
```

### Custom Domain
Most static hosts support custom domains. Update DNS to point to your hosting provider.

## Maintenance

### Updating Dependencies
```bash
# Check for TypeScript updates
npm update typescript

# Rebuild after updates
npm run build
```

### Adding Features
1. Create new TypeScript files in `src/`
2. Add corresponding HTML elements
3. Style with consistent CSS patterns
4. Import and initialize in `main.ts`
5. Test and rebuild

### Performance Optimization
- The template is already optimized for size
- Minimize external dependencies
- Use CDN for large libraries when possible
- Compress images if adding any

This template gives you a solid foundation for building modern, accessible, and maintainable static websites with a distinctive visual style.