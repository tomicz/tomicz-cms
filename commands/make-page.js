const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const {
  validatePageName,
  capitalizeFirst,
  fileExists,
  ensureDirectories,
  initializeTemplates,
  generateHtmlTemplate,
  generateCssTemplate,
  generateJsTemplate,
} = require("../utils/helpers");

async function makePage(pageName, options = {}) {
  try {
    // Validate page name
    const validatedName = validatePageName(pageName);
    const capitalizedName = capitalizeFirst(validatedName);

    // Ensure directories exist
    await ensureDirectories();

    // Initialize templates if they don't exist
    await initializeTemplates();

    // Define file paths
    const htmlFile = `public/pages/${validatedName}.html`;
    const cssFile = `public/css/pages/${validatedName}.css`;
    const jsFile = `public/js/pages/${validatedName}.js`;

    // Check if files already exist
    const filesExist = {
      html: await fileExists(htmlFile),
      css: await fileExists(cssFile),
      js: await fileExists(jsFile),
    };

    const anyFileExists = Object.values(filesExist).some((exists) => exists);

    if (anyFileExists && !options.force) {
      return;
    }

    // Generate file content
    const htmlContent = await generateHtmlTemplate(
      validatedName,
      capitalizedName
    );
    const cssContent = await generateCssTemplate(
      validatedName,
      capitalizedName
    );
    const jsContent = await generateJsTemplate(validatedName, capitalizedName);

    // Write files
    const filesToWrite = [
      { path: htmlFile, content: htmlContent, type: "HTML" },
      { path: cssFile, content: cssContent, type: "CSS" },
      { path: jsFile, content: jsContent, type: "JavaScript" },
    ];

    for (const file of filesToWrite) {
      await fs.writeFile(file.path, file.content, "utf8");
    }

    // Show file sizes
    for (const file of filesToWrite) {
      const stats = await fs.stat(file.path);
      const size = (stats.size / 1024).toFixed(1);
    }
  } catch (error) {
    throw new Error(`Failed to create page: ${error.message}`);
  }
}

module.exports = makePage;
