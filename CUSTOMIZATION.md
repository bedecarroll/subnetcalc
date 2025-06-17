# LLM Customization Guide

This guide provides step-by-step instructions for LLMs (Language Model assistants) to customize this template for specific applications.

## 🎯 Quick Start for LLMs

### Step 1: Understand the Template Structure

This template provides a **generic input-processing-output pattern** with these components:

- **Main Input**: Primary data entry field
- **Options System**: Secondary configuration/settings 
- **Format Selection**: Output styling options
- **Processing Logic**: Core application functionality
- **Results Display**: Formatted output with copy functionality

### Step 2: Identify What to Replace

Look for these markers in the code:

- `<!-- CUSTOMIZE: ... -->` - HTML elements to modify
- `// CUSTOMIZE: ...` - TypeScript/CSS code to replace
- `// TEMPLATE: ...` - Example code showing patterns
- `// KEEP: ...` - Functionality to preserve
- `{{placeholder}}` - Text placeholders to replace

## 🔧 File-by-File Customization

### 1. `package.json` - Project Metadata

```json
{
  "name": "{{projectSlug}}",           // → "your-app-name"
  "description": "{{projectDescription}}" // → "Your app description"
}
```

**Replace:**
- `{{projectSlug}}` with kebab-case app name
- `{{projectDescription}}` with brief description

**Keep:** All scripts, dependencies, and build configuration

### 2. `index.html` - User Interface

**Replace placeholders:**
```html
<title>{{projectTitle}}</title>           <!-- → Your App Title -->
<h1>{{projectTitle}}</h1>                 <!-- → Your App Title -->
<p>{{projectDescription}}</p>             <!-- → Your description -->
```

**Customize main content (lines 25-77):**

**Main Input Section (lines 27-35):**
```html
<label for="main-input">Enter your input:</label>
<!-- CUSTOMIZE: Change label to match your data type -->
<!-- Examples: "Enter URL:", "Enter text to analyze:", "Upload file:" -->

<input type="text" id="main-input" placeholder="Type something...">
<!-- CUSTOMIZE: Update input type and placeholder -->
<!-- Types: text, email, url, file, number, etc. -->
```

**Options Section (lines 37-50):**
- **Keep if using:** Secondary settings/configuration
- **Remove if not needed:** Delete entire `options-section` div
- **Customize labels:** Update "Add options:" to match your use case

**Format Section (lines 52-63):**
```html
<button data-format="default">Default</button>
<button data-format="compact">Compact</button>  
<button data-format="detailed">Detailed</button>
<!-- CUSTOMIZE: Update format names and data-format values -->
<!-- Must match FormatType in utils.ts -->
```

**Process Button (lines 65-69):**
```html
<button id="process-btn">Process</button>
<!-- CUSTOMIZE: Change button text to match your action -->
<!-- Examples: "Analyze", "Convert", "Generate", "Calculate" -->
```

### 3. `src/utils.ts` - Core Logic

**🎯 PRIMARY CUSTOMIZATION TARGET**

**Update Type Definitions:**
```typescript
// CUSTOMIZE: Replace with your format options
export type FormatType = 'default' | 'compact' | 'detailed';
// Examples: 'json' | 'csv' | 'html'
//          'summary' | 'detailed' | 'raw'

// CUSTOMIZE: Update interface for your data
export interface ProcessResult {
  input: string;          // → Your input type
  output: string;         // → Your output type  
  format: FormatType;
  timestamp: Date;
  error?: string;
}
```

**Replace Main Processing Logic:**
```typescript
public static processInput(input: string, format: FormatType): ProcessResult {
  // CUSTOMIZE: Replace this entire method with your logic
  
  // Example patterns:
  // - API call: const response = await fetch(`/api/process?input=${input}`)
  // - Text processing: const result = yourTextProcessor(input)
  // - Data conversion: const output = convertData(input, format)
  // - File processing: const processed = processFile(input)
  
  return {
    input,
    output: yourProcessedResult, // ← Your actual output
    format,
    timestamp: new Date()
  };
}
```

**Update Format Methods:**
```typescript
private static formatDefault(input: string): string {
  // CUSTOMIZE: Your default output format
  return `Your formatted output: ${input}`;
}

private static formatCompact(input: string): string {
  // CUSTOMIZE: Your compact output format  
  return `Compact: ${input}`;
}

private static formatDetailed(input: string): string {
  // CUSTOMIZE: Your detailed output format
  return `Detailed analysis of: ${input}`;
}
```

**Update Available Options:**
```typescript
public static getAvailableOptions(): string[] {
  return [
    'Your Option 1',     // CUSTOMIZE: Replace with your options
    'Your Option 2',
    'Setting A',
    'Mode B'
  ];
}
```

### 4. `src/main.ts` - Application Logic

**Update Class Properties:**
```typescript
class App {
  // CUSTOMIZE: Rename class if desired
  private selectedOptions: string[] = [];    // → Your state data
  private currentFormat: FormatType = 'default';
  
  // CUSTOMIZE: Add your application-specific properties
  private yourAppData: any = {};
}
```

**Update Event Handlers:**
```typescript
private handleProcess(): void {
  // CUSTOMIZE: Replace validation message
  if (!inputText) {
    this.showError('Please enter your input'); // → Your error message
    return;
  }
  
  // CUSTOMIZE: Add your processing logic
  const result = Utils.processInput(inputText, this.currentFormat);
  // OR: const result = await yourApiCall(inputText);
  // OR: const result = yourCustomProcessor(inputText, this.selectedOptions);
  
  this.displayResult(result);
}
```

**Update Result Display:**
```typescript
private generateOptionResult(input: string, option: string): string {
  // CUSTOMIZE: Replace with your option-specific processing
  switch (option) {
    case 'Your Option 1':
      return `Result for option 1: ${input}`;
    case 'Your Option 2':  
      return `Result for option 2: ${input}`;
    default:
      return `Processed ${input} with ${option}`;
  }
}
```

### 5. `styles.css` - Visual Styling

**Update Brand Colors:**
```css
body {
  background: #fff;                /* → Your background color */
  color: #000;                     /* → Your text color */
  font-family: 'Courier New';     /* → Your font family */
}

.container {
  max-width: 900px;               /* → Your content width */
  border: 4px solid #000;         /* → Your border style */
}
```

**Update Tag Colors (in main.ts):**
```typescript
const TAG_COLORS: string[] = [
  '#your-color-1',    // CUSTOMIZE: Your brand colors
  '#your-color-2',
  // ... add more colors
];
```

### 6. Optional: Remove Unused Features

**If not using options/tags system:**
1. Remove options-section from HTML
2. Remove autocomplete setup in main.ts
3. Remove options-related methods
4. Remove option-tag CSS classes

**If not using format selection:**
1. Remove format-section from HTML  
2. Remove format-related methods in main.ts
3. Simplify processInput to single format

## 🚀 Common Application Patterns

### Text Processing App
```typescript
// utils.ts
public static processInput(input: string, format: FormatType): ProcessResult {
  const wordCount = input.split(' ').length;
  const charCount = input.length;
  
  let output = '';
  switch (format) {
    case 'summary':
      output = `${wordCount} words, ${charCount} characters`;
      break;
    case 'uppercase':
      output = input.toUpperCase();
      break;
    case 'reversed':
      output = input.split('').reverse().join('');
      break;
  }
  
  return { input, output, format, timestamp: new Date() };
}
```

### API Integration App
```typescript
// utils.ts  
public static async processInput(input: string, format: FormatType): Promise<ProcessResult> {
  try {
    const response = await fetch('/api/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, format })
    });
    
    const data = await response.json();
    
    return {
      input,
      output: data.result,
      format,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      input,
      output: '',
      format,
      timestamp: new Date(),
      error: `API Error: ${error.message}`
    };
  }
}
```

### Data Converter App
```typescript
// utils.ts
public static processInput(input: string, format: FormatType): ProcessResult {
  try {
    // Parse input (e.g., CSV, JSON, XML)
    const parsedData = JSON.parse(input);
    
    let output = '';
    switch (format) {
      case 'csv':
        output = this.convertToCSV(parsedData);
        break;
      case 'xml':
        output = this.convertToXML(parsedData);
        break;
      case 'table':
        output = this.convertToTable(parsedData);
        break;
    }
    
    return { input, output, format, timestamp: new Date() };
  } catch (error) {
    return {
      input,
      output: '',
      format,
      timestamp: new Date(),
      error: 'Invalid input format'
    };
  }
}
```

## ✅ Testing Your Customizations

After customizing:

1. **Update placeholders:** Ensure all `{{}}` placeholders are replaced
2. **Build the project:** Run `npm run build`
3. **Test functionality:** Run `npm run serve` and test in browser
4. **Check accessibility:** Verify ARIA labels match your content
5. **Test dark mode:** Ensure dark theme works with your colors
6. **Validate TypeScript:** Ensure no type errors

## 🔄 Deployment Checklist

- [ ] All placeholders replaced
- [ ] Core logic customized in utils.ts
- [ ] UI labels updated in HTML
- [ ] Error messages customized
- [ ] Colors/styling updated
- [ ] Build succeeds without errors
- [ ] Functionality tested
- [ ] README.md updated with your project info

## 💡 Pro Tips for LLMs

1. **Start with utils.ts:** This contains the core logic to replace
2. **Preserve accessibility:** Keep ARIA attributes and screen reader support
3. **Maintain TypeScript types:** Update interfaces when changing data structures
4. **Keep theme system:** The dark/light mode toggle is universally useful
5. **Test incrementally:** Make changes, build, and test frequently
6. **Follow patterns:** Use existing patterns for consistency

## 🆘 Common Issues

**Build fails after customization:**
- Check TypeScript types match your data
- Ensure all imports are correct
- Verify HTML element IDs match JavaScript references

**Functionality broken:**
- Check that event handlers reference correct methods
- Verify CSS classes match HTML elements
- Ensure localStorage keys are consistent

**Styling issues:**
- Check dark mode CSS for your custom colors
- Verify responsive design still works
- Test with different content lengths

This template is designed to be easily customizable while maintaining professional functionality and accessibility. Focus on replacing the core logic in `utils.ts` and updating the UI labels to match your application's purpose.