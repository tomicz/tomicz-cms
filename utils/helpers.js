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
  const dirs = ["../public/pages", "../public/css/pages", "../public/js/pages"];

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
  const pagesDir = "../public/pages";

  try {
    const files = await fs.readdir(pagesDir);
    return files
      .filter((file) => file.endsWith(".html"))
      .map((file) => file.replace(".html", ""));
  } catch {
    return [];
  }
}

// Generate HTML template
function generateHtmlTemplate(pageName, pageNameCapitalized) {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <!-- Google tag (gtag.js) -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-RJW428Z054"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "G-RJW428Z054");
    </script>

    <!-- Primary Meta Tags -->
    <meta
      name="description"
      content="${pageNameCapitalized} - Unity game development and C# programming with professional developer Darko Tomic."
    />
    <meta
      name="keywords"
      content="Darko Tomic, Unity tutorials, game development, C# programming, ${pageName}"
    />
    <meta name="author" content="Darko Tomic" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#4CAF50" />

    <!-- Favicon -->
    <link rel="icon" href="../images/favicon.ico" type="image/x-icon" />

    <!-- Title -->
    <title>${pageNameCapitalized} - Darko Tomic</title>

    <!-- Resource Hints -->
    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
      rel="stylesheet"
      media="print"
      onload="this.media='all'"
    />

    <!-- CSS -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
      integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
      media="print"
      onload="this.media='all'"
    />
    <link rel="stylesheet" href="../css/common.css" />
    <link rel="stylesheet" href="../css/components.css" />
    <link rel="stylesheet" href="../css/pages/${pageName}.css" />
  </head>
  <body>
    <page-header></page-header>
    <script
      type="module"
      src="../js/components/page-components/page-header.js"
    ></script>

    <!-- ${pageNameCapitalized} content will go here -->

    <page-links></page-links>
    <script
      type="module"
      src="../js/components/page-components/page-links.js"
    ></script>

    <page-footer></page-footer>
    <script
      type="module"
      src="../js/components/page-components/page-footer.js"
    ></script>

    <script type="module" src="../js/core/main.js"></script>
    <script type="module" src="../js/pages/${pageName}.js"></script>
  </body>
</html>`;
}

// Generate CSS template
function generateCssTemplate(pageName, pageNameCapitalized) {
  return `/* ${pageNameCapitalized} Page Styles */

/* Page-specific styles for ${pageName} */
.${pageName}-page {
    /* Add your page-specific styles here */
}

/* Responsive design */
@media (max-width: 768px) {
    .${pageName}-page {
        /* Mobile styles */
    }
}`;
}

// Generate JavaScript template
function generateJsTemplate(pageName, pageNameCapitalized) {
  return `// ${pageNameCapitalized} Page JavaScript

// Page-specific functionality for ${pageName}
document.addEventListener('DOMContentLoaded', function() {
    // Add your page-specific JavaScript here
    console.log('${pageNameCapitalized} page loaded');
});`;
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
  generateHtmlTemplate,
  generateCssTemplate,
  generateJsTemplate,
};
