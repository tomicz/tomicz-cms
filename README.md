# Tomicz-CMS

A powerful CLI-based content management system for generating and managing website content, featuring an integrated image library with automatic optimization.

## 🚀 Features

- **CLI-based CMS** with intuitive commands
- **Template-driven** content generation
- **Image Library** with automatic optimization
- **Page Management** (create, delete, list)
- **Customizable templates** for different content types
- **Open-source** and easily extensible

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **CLI Framework:** Commander.js
- **Template Engine:** Custom JavaScript templating
- **Image Processing:** Jimp (pure JavaScript)
- **Testing:** Jest

## 📁 Project Structure

```
tomicz-cms/
├── bin/                    # CLI executable
│   └── tomicz.js          # Main CLI entry point
├── commands/               # CLI commands
│   ├── make-page.js       # Create new pages
│   ├── delete-page.js     # Remove pages
│   └── list-pages.js      # List all pages
├── templates/              # Template files
│   ├── components/         # Reusable components
│   ├── css/               # CSS templates
│   ├── images/            # Image assets
│   └── pages/             # Page templates
├── utils/                  # Utility functions
│   └── helpers.js         # Core helper functions
├── tests/                  # Test files
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎯 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/tomicz-cms.git
   cd tomicz-cms
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build the CLI tool:**

   ```bash
   npm run build
   ```

4. **Make it executable:**

   ```bash
   chmod +x bin/tomicz.js
   ```

5. **Link globally (optional):**
   ```bash
   npm link
   ```

## 📚 Usage

### Basic Commands

```bash
# Initialize website structure (creates image library)
tomicz init

# Create a new page
tomicz make-page page-name

# Delete a page
tomicz delete-page page-name

# List all pages
tomicz list-pages

# Show help
tomicz --help
```

### 🖼️ Image Library Feature

The image library is automatically created when you run `tomicz init` and provides a professional image management interface.

#### What Gets Created

Running `tomicz init` generates:

- `public/pages/image-library.html` - Full-screen admin interface
- `public/css/pages/image-library.css` - Admin styling
- `public/js/pages/image-library.js` - Admin functionality

#### Image Library Features

##### **Automatic Image Optimization**

- **Thumbnail:** 150x150px (fast previews)
- **Medium:** 400x400px (blog listings)
- **Large:** 800x800px (featured areas)
- **Format Support:** JPEG, PNG, WebP, and more
- **Metadata Tracking:** File size, upload date, tags

##### **Management Interface**

- **Web-based UI** (not CLI-based)
- **API Key Protection** for security
- **Drag & Drop** uploads
- **Bulk Operations** for existing images
- **Search & Filter** by tags
- **URL Copying** for optimized versions

#### Integration Requirements

To use the image library, your main project needs:

1. **Node.js server** with Express.js
2. **Image processing routes** (`/api/images/*`)
3. **Environment variables** for API keys
4. **Jimp dependency** for image optimization

## 🎨 Customization

### Adding New Commands

1. **Create command file:**

   ```javascript
   // commands/new-feature.js
   const { Command } = require("commander");

   module.exports = new Command("new-feature")
     .description("Description of new feature")
     .action(async () => {
       // Your command logic here
     });
   ```

2. **Register in main CLI:**
   ```javascript
   // bin/tomicz.js
   require("../commands/new-feature");
   ```

### Extending Templates

#### **Page Templates**

- **Location:** `templates/pages/`
- **Files:** `page.html`, `page.css`, `page.js`
- **Variables:** Customizable placeholders

#### **Component Templates**

- **Location:** `templates/components/`
- **Reusable:** Across multiple pages
- **Customizable:** Props and attributes

### Template Variables

Templates support dynamic content through variables:

```javascript
// In helpers.js
const templateData = {
  pageTitle: 'My Page',
  pageDescription: 'Page description',
  customData: 'Custom value'
};

// In templates
<h1>{{pageTitle}}</h1>
<p>{{pageDescription}}</p>
```

## 🔧 Development

### Building

```bash
# Development build
npm run build

# Production build
npm run build:prod

# Watch mode
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Code Style

- **ESLint** for code quality
- **Prettier** for formatting
- **Jest** for testing
- **Commander.js** for CLI structure

## 🚀 Deployment

### Distribution

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Package for distribution:**

   ```bash
   npm pack
   ```

3. **Install in target project:**
   ```bash
   npm install tomicz-cms-1.0.0.tgz
   ```

### Integration

The CMS integrates with any Node.js project:

```javascript
// In your main project
const { initializeTemplates } = require("tomicz-cms");

// Initialize with custom options
await initializeTemplates({
  outputDir: "./public",
  customTemplates: "./custom-templates",
});
```

## 🔧 Troubleshooting

### Common Issues

#### **Command Not Found**

- Ensure `bin/tomicz.js` is executable
- Check if `npm link` was run
- Verify PATH includes npm global bin

#### **Template Generation Fails**

- Check file permissions in output directory
- Verify template files exist
- Review error logs for specific issues

#### **Image Library Not Working**

- Ensure main project has required dependencies
- Check API routes are properly configured
- Verify environment variables are set

### Debug Mode

Enable verbose logging:

```bash
# Set debug environment variable
DEBUG=tomicz:* tomicz init

# Or use verbose flag
tomicz init --verbose
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone and setup
git clone https://github.com/your-username/tomicz-cms.git
cd tomicz-cms
npm install
npm run build

# Link for development
npm link
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:

- Check the troubleshooting section
- Review the code examples
- Open an issue on GitHub
- Check the main project integration docs

---

**Built with ❤️ for the open-source community**
