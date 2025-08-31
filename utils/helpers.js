const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");

// Validate page name
function validatePageName(name) {
  if (!name || typeof name !== "string") {
    throw new Error("Page name is required");
  }

  // Check for valid characters (alphanumeric, hyphens, underscores)
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new Error(
      "Page name can only contain letters, numbers, hyphens, and underscores"
    );
  }

  return name.toLowerCase();
}

// Capitalize first letter
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Check if file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Ensure directories exist
async function ensureDirectories() {
  const dirs = ["public/pages", "public/css/pages", "public/js/pages"];

  for (const dir of dirs) {
    await fs.ensureDir(dir);
  }
}

// Get file stats
async function getFileStats(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: formatFileSize(stats.size),
      modified: stats.mtime.toLocaleDateString(),
      created: stats.birthtime.toLocaleDateString(),
    };
  } catch {
    return null;
  }
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Confirm action
async function confirmAction(message, defaultValue = false) {
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message,
      default: defaultValue,
    },
  ]);
  return confirmed;
}

// Get available pages
async function getAvailablePages() {
  const pagesDir = "public/pages";

  try {
    const files = await fs.readdir(pagesDir);
    return files
      .filter((file) => file.endsWith(".html"))
      .map((file) => file.replace(".html", ""));
  } catch {
    return [];
  }
}

// Initialize templates directory
async function initializeTemplates() {
  const templatesDir = 'templates';
  const pagesTemplatesDir = 'templates/pages';
  
  try {
    // Create templates directory if it doesn't exist
    await fs.ensureDir(templatesDir);
    await fs.ensureDir(pagesTemplatesDir);
    
    // Check if template files exist, if not copy them
    const templateFiles = [
      { src: 'tomicz-cms/templates/pages/page.html', dest: 'templates/pages/page.html' },
      { src: 'tomicz-cms/templates/pages/page.css', dest: 'templates/pages/page.css' },
      { src: 'tomicz-cms/templates/pages/page.js', dest: 'templates/pages/page.js' }
    ];
    
    for (const file of templateFiles) {
      if (!(await fileExists(file.dest))) {
        await fs.copy(file.src, file.dest);
        console.log(chalk.green(`✅ Created template: ${file.dest}`));
      }
    }
  } catch (error) {
    console.log(chalk.yellow(`⚠️  Warning: Could not initialize templates: ${error.message}`));
  }
}

// Read and process template
async function readTemplate(templatePath, pageName, pageNameCapitalized) {
  try {
    let content = await fs.readFile(templatePath, 'utf8');
    
    // Replace placeholders
    content = content.replace(/\{\{PAGE_NAME\}\}/g, pageName);
    content = content.replace(/\{\{PAGE_NAME_CAPITALIZED\}\}/g, pageNameCapitalized);
    
    return content;
  } catch (error) {
    throw new Error(`Failed to read template ${templatePath}: ${error.message}`);
  }
}

// Generate HTML template
async function generateHtmlTemplate(pageName, pageNameCapitalized) {
  const templatePath = 'templates/pages/page.html';
  
  if (!(await fileExists(templatePath))) {
    throw new Error('HTML template not found. Please run "tomicz init" to initialize templates.');
  }
  
  return await readTemplate(templatePath, pageName, pageNameCapitalized);
}

// Generate CSS template
async function generateCssTemplate(pageName, pageNameCapitalized) {
  const templatePath = 'templates/pages/page.css';
  
  if (!(await fileExists(templatePath))) {
    throw new Error('CSS template not found. Please run "tomicz init" to initialize templates.');
  }
  
  return await readTemplate(templatePath, pageName, pageNameCapitalized);
}

// Generate JavaScript template
async function generateJsTemplate(pageName, pageNameCapitalized) {
  const templatePath = 'templates/pages/page.js';
  
  if (!(await fileExists(templatePath))) {
    throw new Error('JavaScript template not found. Please run "tomicz init" to initialize templates.');
  }
  
  return await readTemplate(templatePath, pageName, pageNameCapitalized);
}

module.exports = {
  validatePageName,
  capitalizeFirst,
  fileExists,
  ensureDirectories,
  getFileStats,
  formatFileSize,
  confirmAction,
  getAvailablePages,
  initializeTemplates,
  generateHtmlTemplate,
  generateCssTemplate,
  generateJsTemplate,
};
