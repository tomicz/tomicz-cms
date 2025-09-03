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

    // Create image-library page if it doesn't exist
    const imageLibraryPath = "public/pages/image-library.html";
    if (!(await fileExists(imageLibraryPath))) {
      try {
        // Ensure all necessary directories exist
        await fs.ensureDir("public/pages");
        await fs.ensureDir("public/css/pages");
        await fs.ensureDir("public/js/pages");

        // Generate the image library page files
        const imageLibraryTemplates = await generateImageLibraryTemplate();

        // Create the page files
        await fs.writeFile(imageLibraryPath, imageLibraryTemplates.htmlContent);
        await fs.writeFile(
          "public/css/pages/image-library.css",
          imageLibraryTemplates.cssContent
        );
        await fs.writeFile(
          "public/js/pages/image-library.js",
          imageLibraryTemplates.jsContent
        );

        console.log(
          chalk.green(`✅ Created image library: ${imageLibraryPath}`)
        );
        console.log(
          chalk.blue(
            `📄 Image library files created: public/css/pages/image-library.css, public/js/pages/image-library.js`
          )
        );
      } catch (error) {
        console.log(
          chalk.yellow(
            `⚠️  Warning: Could not create image library page: ${error.message}`
          )
        );
      }
    } else {
      console.log(
        chalk.blue(`ℹ️  Image library already exists: ${imageLibraryPath}`)
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

// Generate image library page template
async function generateImageLibraryTemplate() {
  const htmlContent = `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <!-- Primary Meta Tags -->
    <meta
      name="description"
      content="Image Library - Manage and organize your website images"
    />
    <meta
      name="keywords"
      content="image library, media management, content management"
    />
    <meta name="author" content="Content Manager" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="#4CAF50" />

    <!-- Favicon -->
    <link rel="icon" href="../images/favicon.ico" type="image/x-icon" />

    <!-- Title -->
    <title>Image Library - Content Management</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
      rel="stylesheet"
    />

    <!-- CSS -->
    <link rel="stylesheet" href="../css/common.css" />
    <link rel="stylesheet" href="../css/components.css" />
    <link rel="stylesheet" href="../css/pages/image-library.css" />
  </head>
  <body>
    <page-header></page-header>
    <script type="module" src="../js/components/page/header.js"></script>

    <main class="page-content">
      <div id="image-library-main">
        <!-- Image library content will be loaded here -->
      </div>
    </main>

    <page-links></page-links>
    <script type="module" src="../js/components/page/links.js"></script>

    <page-footer></page-header>
    <script type="module" src="../js/components/page/footer.js"></script>

    <script type="module" src="../js/core/main.js"></script>
    <script type="module" src="../js/pages/image-library.js"></script>
  </body>
</html>`;

  const cssContent = `/* Image Library Page Styles */

.page-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.auth-form h1 {
  color: #333;
  margin-bottom: 1rem;
}

.auth-form input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 1rem 0;
  font-size: 1rem;
}

.auth-form button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

.auth-form button:hover {
  background: #45a049;
}

.auth-error {
  color: #ff6b6b;
  margin-top: 1rem;
}

.admin-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.image-library-section {
  padding: 2rem;
  border-bottom: 1px solid #eee;
}

.image-library-section h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

.image-library-section p {
  color: #666;
  margin-bottom: 1.5rem;
}

.upload-interface {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.upload-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.upload-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.upload-btn:hover {
  background: #1976D2;
}

.save-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.save-btn:hover {
  background: #45a049;
}

.clear-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.clear-btn:hover {
  background: #d32f2f;
}

.upload-status {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  background: #f5f5f5;
}

.images-section {
  padding: 2rem;
}

.images-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.image-item {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.image-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-preview {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f5f5f5;
}

.image-info {
  padding: 1rem;
}

.image-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.image-meta {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.image-actions {
  display: flex;
  gap: 0.5rem;
}

.image-actions button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.copy-btn {
  background: #2196F3;
  color: white;
}

.copy-btn:hover {
  background: #1976D2;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.delete-btn:hover {
  background: #d32f2f;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
}

.stat-label {
  color: #666;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }
  
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .upload-actions {
    flex-direction: column;
    align-items: stretch;
  }
}`;

  const jsContent = `// Image Library Page JavaScript

// API Key for authentication (will be loaded from environment)
let API_KEY = null;

// Authentication check
function checkAuthentication() {
  const storedKey = localStorage.getItem("imageLibraryApiKey");

  if (!storedKey || storedKey !== API_KEY) {
    showAuthForm();
    return false;
  }

  return true;
}

// Show authentication form
function showAuthForm() {
  const body = document.body;
  body.innerHTML = \`
    <div class="auth-container">
      <div class="auth-form">
        <h1>🔐 Image Library Access</h1>
        <p>Enter your password to access the image library:</p>
        <input type="password" id="apiKeyInput" placeholder="Enter password..." />
        <button onclick="authenticate()">Access Image Library</button>
        <p class="auth-error" id="authError" style="display: none; color: #ff6b6b;"></p>
      </div>
    </div>
  \`;
}

// Authenticate user (global function)
window.authenticate = function () {
  const input = document.getElementById("apiKeyInput");
  const error = document.getElementById("authError");
  const key = input.value.trim();

  if (key === API_KEY) {
    localStorage.setItem("imageLibraryApiKey", key);
    location.reload();
  } else {
    error.textContent = "Invalid password. Please try again.";
    error.style.display = "block";
    input.value = "";
  }
};

// Copy image URL to clipboard
window.copyImageUrl = async function (filename, buttonEl) {
  try {
    const origin = window.location.origin;
    const url = \`\${origin}/api/images/\${filename}\`;

    await navigator.clipboard.writeText(url);

    const originalText = buttonEl.textContent;
    buttonEl.textContent = "✅ Copied";
    buttonEl.disabled = true;
    setTimeout(() => {
      buttonEl.textContent = originalText;
      buttonEl.disabled = false;
    }, 1200);
  } catch (err) {
    console.error("Failed to copy:", err);
    alert(
      "Couldn't copy the URL. Please copy it manually: \\n" +
        \`\${window.location.origin}/api/images/\${filename}\`
    );
  }
};

// Delete image
window.deleteImage = function (filename) {
  if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
    deleteImageConfirm(filename);
  }
};

async function deleteImageConfirm(filename) {
  try {
    const response = await fetch(\`/api/images/\${filename}\`, {
      method: "DELETE",
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    const result = await response.json();

    if (result.success) {
      alert("Image deleted successfully!");
      loadImages();
    } else {
      alert(\`Failed to delete image: \${result.error}\`);
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("Failed to delete image. Please try again.");
  }
}

// Upload image
window.uploadImage = function () {
  document.getElementById("imageFileInput").click();
};

// Handle image file selection
window.handleImageSelect = function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const statusDiv = document.getElementById("uploadStatus");
  statusDiv.innerHTML = \`<p style="color: #4CAF50;">📁 Image selected: \${file.name}</p>\`;

  // Store the file for later upload
  window.selectedImageFile = file;

  // Auto-fill the filename field
  document.getElementById("imageFilename").value = file.name;
};

// Save image
window.saveImage = async function () {
  const filename = document.getElementById("imageFilename").value;
  const description = document.getElementById("imageDescription").value;
  const tags = document.getElementById("imageTags").value;

  if (!filename) {
    alert("Please enter a filename!");
    return;
  }

  if (!window.selectedImageFile) {
    alert("Please select an image file!");
    return;
  }

  const statusDiv = document.getElementById("uploadStatus");
  statusDiv.innerHTML = '<p style="color: #ffa500;">📤 Uploading image...</p>';

  try {
    const formData = new FormData();
    formData.append("image", window.selectedImageFile);

    const response = await fetch(\`/api/images/upload/\${filename}\`, {
      method: "PUT",
      headers: {
        "X-API-Key": API_KEY,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      statusDiv.innerHTML = \`<p style="color: #4CAF50;">✅ Image uploaded successfully: \${data.filename}</p>\`;
      
      // Clear form
      document.getElementById("imageFilename").value = "";
      document.getElementById("imageDescription").value = "";
      document.getElementById("imageTags").value = "";
      window.selectedImageFile = null;
      
      // Reload images
      loadImages();
    } else {
      statusDiv.innerHTML = \`<p style="color: #ff6b6b;">❌ Image upload failed: \${data.error}</p>\`;
    }
  } catch (error) {
    console.error("Upload error:", error);
    statusDiv.innerHTML = '<p style="color: #ff6b6b;">❌ Image upload failed. Please try again.</p>';
  }
};

// Clear form
window.clearForm = function () {
  if (confirm("Are you sure you want to clear the form? All unsaved changes will be lost.")) {
    document.getElementById("imageFilename").value = "";
    document.getElementById("imageDescription").value = "";
    document.getElementById("imageTags").value = "";
    window.selectedImageFile = null;
    
    const statusDiv = document.getElementById("uploadStatus");
    if (statusDiv) {
      statusDiv.innerHTML = "";
    }
    
    const fileInput = document.getElementById("imageFileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  }
};

// Load all images
async function loadImages() {
  try {
    const response = await fetch("/api/images/list", {
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    const data = await response.json();
    const imagesList = document.getElementById("imagesList");

    if (data.images && data.images.length > 0) {
      imagesList.innerHTML = data.images
        .map(
          (image) => \`
          <div class="image-item">
            <img src="/api/images/\${image.filename}" alt="\${image.description || image.filename}" class="image-preview" />
            <div class="image-info">
              <h3>\${image.filename}</h3>
              <p class="image-meta">
                <span class="size">\${image.size}</span> • 
                <span class="date">\${new Date(image.uploadDate).toLocaleDateString()}</span>
              </p>
              <div class="image-actions">
                <button onclick="copyImageUrl('\${image.filename}', this)" class="copy-btn" title="Copy image URL">🔗 Copy URL</button>
                <button onclick="deleteImage('\${image.filename}')" class="delete-btn">🗑️ Delete</button>
              </div>
            </div>
          </div>
        \`
        )
        .join("");

      // Show statistics
      const totalImages = data.images.length;
      const totalSize = data.images.reduce((sum, img) => sum + (img.sizeBytes || 0), 0);
      const avgSize = totalSize / totalImages;

      document.getElementById("imagesStats").innerHTML = \`
        <div class="stats-container">
          <div class="stat-item">
            <span class="stat-number">\${totalImages}</span>
            <span class="stat-label">Total Images</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">\${formatFileSize(totalSize)}</span>
            <span class="stat-label">Total Size</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">\${formatFileSize(avgSize)}</span>
            <span class="stat-label">Average Size</span>
          </div>
        </div>
      \`;
    } else {
      imagesList.innerHTML = "<p>No images found.</p>";
      document.getElementById("imagesStats").innerHTML = "";
    }
  } catch (error) {
    console.error("Error loading images:", error);
    document.getElementById("imagesList").innerHTML = "<p>Error loading images.</p>";
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

// Page-specific functionality
document.addEventListener("DOMContentLoaded", function () {
  console.log("Image library page loaded");

  // Check authentication first
  if (!checkAuthentication()) {
    return;
  }

  // User is authenticated, show image library interface
  showImageLibrary();
});

// Show image library interface
function showImageLibrary() {
  const mainContent = document.getElementById("image-library-main");
  mainContent.innerHTML = \`
    <div class="admin-container">
      <div class="image-library-section">
        <h1>🖼️ Image Library</h1>
        <p>Upload and manage your website images</p>
        <div class="upload-interface">
          <div class="form-group">
            <label for="imageFilename">Filename:</label>
            <input type="text" id="imageFilename" placeholder="Enter filename (e.g., my-image.jpg)" />
          </div>
          <div class="form-group">
            <label for="imageDescription">Description:</label>
            <textarea id="imageDescription" placeholder="Optional image description..."></textarea>
          </div>
          <div class="form-group">
            <label for="imageTags">Tags (comma-separated):</label>
            <input type="text" id="imageTags" placeholder="website, hero, blog" />
          </div>
          <div class="upload-actions">
            <button type="button" onclick="uploadImage()" class="upload-btn">📁 Select Image</button>
            <input type="file" id="imageFileInput" accept="image/*" style="display: none;" onchange="handleImageSelect(event)" />
            <button onclick="saveImage()" class="save-btn">💾 Upload Image</button>
            <button onclick="clearForm()" class="clear-btn">🧹 Clear Form</button>
          </div>
          <div id="uploadStatus" class="upload-status"></div>
        </div>
      </div>
      
      <div class="images-section">
        <h2>📚 All Images</h2>
        <div id="imagesList" class="images-grid">
          <p>Loading images...</p>
        </div>
        <div id="imagesStats" class="images-stats"></div>
      </div>
    </div>
  \`;

  // Load images list
  loadImages();
}

// Load API key from environment (this will be replaced by the actual key)
async function loadApiKey() {
  try {
    // Try to get API key from environment or config
    const response = await fetch("/api/config");
    const config = await response.json();
    API_KEY = config.API_SECRET_KEY;
  } catch (error) {
    console.error("Failed to load API key:", error);
    // Fallback to a default or show error
    alert("Failed to load API configuration. Please check your setup.");
  }
}

// Initialize when page loads
loadApiKey();`;

  return { htmlContent, cssContent, jsContent };
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
  generateImageLibraryTemplate,
};
