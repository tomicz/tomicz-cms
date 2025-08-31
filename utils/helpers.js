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
  const templatesDir = "templates";
  const pagesTemplatesDir = "templates/pages";
  const componentsDir = "public/js/components/page";
  const imagesDir = "public/images";
  const cssDir = "public/css";

  // Get the path to the installed tomicz-cms package
  const path = require("path");
  const packagePath = path.dirname(require.resolve("../package.json"));
  const templatesPath = path.join(packagePath, "templates");

  try {
    // Create directories if they don't exist
    await fs.ensureDir(templatesDir);
    await fs.ensureDir(pagesTemplatesDir);
    await fs.ensureDir(componentsDir);
    await fs.ensureDir(imagesDir);
    await fs.ensureDir(cssDir);

    // Check if template files exist, if not copy them
    const templateFiles = [
      {
        src: path.join(templatesPath, "pages/page.html"),
        dest: "templates/pages/page.html",
      },
      {
        src: path.join(templatesPath, "pages/page.css"),
        dest: "templates/pages/page.css",
      },
      {
        src: path.join(templatesPath, "pages/page.js"),
        dest: "templates/pages/page.js",
      },
    ];

    // Check if web component files exist, if not copy them
    const componentFiles = [
      {
        src: path.join(templatesPath, "components/header.js"),
        dest: "public/js/components/page/header.js",
      },
      {
        src: path.join(templatesPath, "components/links.js"),
        dest: "public/js/components/page/links.js",
      },
      {
        src: path.join(templatesPath, "components/footer.js"),
        dest: "public/js/components/page/footer.js",
      },
    ];

    // Check if essential image files exist, if not copy them
    const imageFiles = [
      {
        src: path.join(templatesPath, "images/Logo_Light_Text.svg"),
        dest: "public/images/Logo_Light_Text.svg",
      },
      {
        src: path.join(templatesPath, "images/favicon.ico"),
        dest: "public/images/favicon.ico",
      },
    ];

    // Check if essential CSS files exist, if not copy them
    const cssFiles = [
      {
        src: path.join(templatesPath, "css/common.css"),
        dest: "public/css/common.css",
      },
      {
        src: path.join(templatesPath, "css/components.css"),
        dest: "public/css/components.css",
      },
    ];

    // Copy page templates
    for (const file of templateFiles) {
      if (!(await fileExists(file.dest))) {
        await fs.copy(file.src, file.dest);
        console.log(chalk.green(`✅ Created template: ${file.dest}`));
      }
    }

    // Copy web component files
    for (const file of componentFiles) {
      if (!(await fileExists(file.dest))) {
        await fs.copy(file.src, file.dest);
        console.log(chalk.green(`✅ Created component: ${file.dest}`));
      }
    }

    // Copy essential image files
    for (const file of imageFiles) {
      if (!(await fileExists(file.dest))) {
        await fs.copy(file.src, file.dest);
        console.log(chalk.green(`✅ Created image: ${file.dest}`));
      }
    }

    // Copy essential CSS files
    for (const file of cssFiles) {
      if (!(await fileExists(file.dest))) {
        await fs.copy(file.src, file.dest);
        console.log(chalk.green(`✅ Created CSS: ${file.dest}`));
      }
    }

    // Create index.html page if it doesn't exist in public/
    const publicIndexPath = "public/index.html";
    if (!(await fileExists(publicIndexPath))) {
      try {
        // Ensure all necessary directories exist
        await fs.ensureDir("public/pages");
        await fs.ensureDir("public/css/pages");
        await fs.ensureDir("public/js/pages");

        // Create index page using make-page functionality
        const pageName = "index";
        const pageNameCapitalized = capitalizeFirst(pageName);

        // Generate the page files
        const htmlContent = await generateHtmlTemplate(
          pageName,
          pageNameCapitalized
        );
        const cssContent = await generateCssTemplate(
          pageName,
          pageNameCapitalized
        );
        const jsContent = await generateJsTemplate(
          pageName,
          pageNameCapitalized
        );

        // Create the page files in public/pages/ first
        await fs.writeFile(`public/pages/${pageName}.html`, htmlContent);
        await fs.writeFile(`public/css/pages/${pageName}.css`, cssContent);
        await fs.writeFile(`public/js/pages/${pageName}.js`, jsContent);

        // Move the HTML file to public/index.html
        await fs.move(`public/pages/${pageName}.html`, publicIndexPath);

        console.log(chalk.green(`✅ Created homepage: ${publicIndexPath}`));
        console.log(
          chalk.blue(
            `📄 Page files created: public/css/pages/${pageName}.css, public/js/pages/${pageName}.js`
          )
        );
      } catch (error) {
        console.log(
          chalk.yellow(
            `⚠️  Warning: Could not create index page: ${error.message}`
          )
        );
      }
    } else {
      console.log(
        chalk.blue(`ℹ️  Homepage already exists: ${publicIndexPath}`)
      );
    }
  } catch (error) {
    console.log(
      chalk.yellow(
        `⚠️  Warning: Could not initialize templates: ${error.message}`
      )
    );
  }
}

// Read and process template
async function readTemplate(templatePath, pageName, pageNameCapitalized) {
  try {
    let content = await fs.readFile(templatePath, "utf8");

    // Replace placeholders
    content = content.replace(/\{\{PAGE_NAME\}\}/g, pageName);
    content = content.replace(
      /\{\{PAGE_NAME_CAPITALIZED\}\}/g,
      pageNameCapitalized
    );

    return content;
  } catch (error) {
    throw new Error(
      `Failed to read template ${templatePath}: ${error.message}`
    );
  }
}

// Generate HTML template
async function generateHtmlTemplate(pageName, pageNameCapitalized) {
  const templatePath = "templates/pages/page.html";

  if (!(await fileExists(templatePath))) {
    throw new Error(
      'HTML template not found. Please run "tomicz init" to initialize templates.'
    );
  }

  return await readTemplate(templatePath, pageName, pageNameCapitalized);
}

// Generate CSS template
async function generateCssTemplate(pageName, pageNameCapitalized) {
  const templatePath = "templates/pages/page.css";

  if (!(await fileExists(templatePath))) {
    throw new Error(
      'CSS template not found. Please run "tomicz init" to initialize templates.'
    );
  }

  return await readTemplate(templatePath, pageName, pageNameCapitalized);
}

// Generate JavaScript template
async function generateJsTemplate(pageName, pageNameCapitalized) {
  const templatePath = "templates/pages/page.js";

  if (!(await fileExists(templatePath))) {
    throw new Error(
      'JavaScript template not found. Please run "tomicz init" to initialize templates.'
    );
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
