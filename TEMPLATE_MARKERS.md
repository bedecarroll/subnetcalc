# Template Markers Reference

This file lists all template placeholders that need to be replaced when customizing this template.

## Required Replacements

### package.json
```json
{
  "name": "{{projectSlug}}",           // ← Replace with your-app-name (kebab-case)
  "description": "{{projectDescription}}"  // ← Replace with your app description
}
```

**Examples:**
- `{{projectSlug}}` → `"text-analyzer"`, `"url-shortener"`, `"data-converter"`
- `{{projectDescription}}` → `"A tool for analyzing text patterns"`, `"Simple URL shortening service"`

### index.html
```html
<title>{{projectTitle}}</title>        <!-- ← Replace with Your App Title -->
<h1>{{projectTitle}}</h1>              <!-- ← Replace with Your App Title -->  
<p>{{projectDescription}}</p>          <!-- ← Replace with your description -->
```

**Examples:**
- `{{projectTitle}}` → `"Text Analyzer"`, `"URL Shortener"`, `"Data Converter"`
- `{{projectDescription}}` → `"Analyze text patterns and statistics"`, `"Create short links"`

## Search and Replace

To quickly replace all placeholders:

1. **Find:** `{{projectSlug}}`
   **Replace:** `your-app-name`

2. **Find:** `{{projectTitle}}`  
   **Replace:** `Your App Title`

3. **Find:** `{{projectDescription}}`
   **Replace:** `Your app description`

## Validation

After replacement, ensure:
- [ ] No `{{}}` markers remain in any files
- [ ] package.json name follows npm naming rules (lowercase, no spaces)
- [ ] HTML title appears correctly in browser tab
- [ ] Header and description display properly on page

## Files Containing Placeholders

- `package.json` (lines 2, 8)
- `index.html` (lines 7, 16, 22)  
- Various documentation files (update as needed)

Remove this file after completing customization.