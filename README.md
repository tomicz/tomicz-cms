# Tomicz CMS

A lightweight console-based CMS (Content Management System) for managing web pages and content.

## Features

- **Page Management**: Create, delete, and list web pages
- **File Organization**: Automatically organizes HTML, CSS, and JavaScript files
- **Template System**: Generates pages with consistent structure and styling
- **Cross-platform**: Works on macOS and Linux

## Scripts

### `make-page.sh <page-name>`
Creates a new page with all necessary files:
- `public/pages/<page-name>.html` - Main HTML file
- `public/css/pages/<page-name>.css` - Page-specific styles
- `public/js/pages/<page-name>.js` - Page-specific JavaScript

**Usage:**
```bash
./make-page.sh about
```

### `delete-page.sh <page-name>`
Safely deletes a page and all its associated files with confirmation.

**Usage:**
```bash
./delete-page.sh about
```

### `list-pages.sh`
Lists all existing pages with details including file sizes and modification dates.

**Usage:**
```bash
./list-pages.sh
```

## Installation

1. Clone this repository
2. Make scripts executable:
   ```bash
   chmod +x *.sh
   ```
3. Use the scripts to manage your pages

## Project Structure

The scripts expect the following directory structure:
```
public/
├── pages/          # HTML pages
├── css/
│   └── pages/      # Page-specific CSS
└── js/
    └── pages/      # Page-specific JavaScript
```

## License

MIT License - feel free to use and modify for your projects.
