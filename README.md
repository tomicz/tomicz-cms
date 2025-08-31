# Tomicz CMS

A lightweight console-based CMS (Content Management System) for managing web pages and content.

## Features

- **Page Management**: Create, delete, and list web pages
- **File Organization**: Automatically organizes HTML, CSS, and JavaScript files
- **Template System**: Generates pages with consistent structure and styling
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Interactive CLI**: Beautiful command-line interface with colored output
- **Smart Validation**: Input validation and error handling

## CLI Commands

### `tomicz make-page <name>`

Creates a new page with all necessary files:

- `public/pages/<name>.html` - Main HTML file
- `public/css/pages/<name>.css` - Page-specific styles
- `public/js/pages/<name>.js` - Page-specific JavaScript

**Usage:**

```bash
tomicz make-page about
tomicz create about
```

**Options:**

- `--force` - Overwrite existing files
- `--template <template>` - Use specific template

### `tomicz delete-page <name>`

Safely deletes a page and all its associated files with confirmation.

**Usage:**

```bash
tomicz delete-page about
tomicz remove about
```

**Options:**

- `--force` - Skip confirmation prompt

### `tomicz list-pages`

Lists all existing pages with details including file sizes and modification dates.

**Usage:**

```bash
tomicz list-pages
tomicz list
```

**Options:**

- `--simple` - Show simple list only

### `tomicz help`

Shows detailed help information and examples.

## Installation

### Option 1: Global Installation (Recommended)

```bash
npm install -g .
```

### Option 2: Local Usage

```bash
npm install
node bin/tomicz.js make-page about
```

### Option 3: Using npx

```bash
npx tomicz-cms make-page about
```

## Quick Start

1. **Install the CLI:**

   ```bash
   npm install -g .
   ```

2. **Create your first page:**

   ```bash
   tomicz make-page about
   ```

3. **List all pages:**

   ```bash
   tomicz list-pages
   ```

4. **Delete a page:**
   ```bash
   tomicz delete-page about
   ```

## Project Structure

The CLI expects the following directory structure:

```
public/
├── pages/          # HTML pages
├── css/
│   └── pages/      # Page-specific CSS
└── js/
    └── pages/      # Page-specific JavaScript
```

## Development

### Prerequisites

- Node.js 14.0.0 or higher
- npm

### Setup

```bash
git clone https://github.com/tomicz/tomicz-cms.git
cd tomicz-cms
npm install
```

### Testing

```bash
# Test the CLI locally
node bin/tomicz.js --help
node bin/tomicz.js make-page test
```

## License

MIT License - feel free to use and modify for your projects.
