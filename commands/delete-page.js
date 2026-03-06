const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const {
  validatePageName,
  fileExists,
  getFileStats,
  confirmAction,
  getAvailablePages,
} = require("../utils/helpers");

async function deletePage(pageName, options = {}) {
  try {
    // Validate page name
    const validatedName = validatePageName(pageName);

    // Define file paths
    const htmlFile = `public/pages/${validatedName}.html`;
    const cssFile = `public/css/pages/${validatedName}.css`;
    const jsFile = `public/js/pages/${validatedName}.js`;

    // Check if page exists
    if (!(await fileExists(htmlFile))) {
      const availablePages = await getAvailablePages();

      if (availablePages.length === 0) {
        throw new Error("No pages found in public/pages/ directory");
      }

      return;
    }

    // Get file information
    const filesToCheck = [
      { path: htmlFile, type: "HTML" },
      { path: cssFile, type: "CSS" },
      { path: jsFile, type: "JavaScript" },
    ];

    let totalSize = 0;
    const existingFiles = [];

    for (const file of filesToCheck) {
      if (await fileExists(file.path)) {
        const stats = await getFileStats(file.path);
        if (stats) {
          existingFiles.push(file);
          totalSize += stats.size;
        }
      }
    }

    if (existingFiles.length === 0) {
      return;
    }

    // Confirm deletion
    if (!options.force) {
      const confirmed = await confirmAction(
        chalk.red(
          `\n⚠️  Are you sure you want to delete "${validatedName}" and all its files?`
        ),
        false
      );

      if (!confirmed) {
        return;
      }
    }

    for (const file of existingFiles) {
      try {
        await fs.remove(file.path);
      } catch (error) {}
    }

    // Show remaining pages
    const remainingPages = await getAvailablePages();
    if (remainingPages.length > 0) {
    } else {
    }
  } catch (error) {
    throw new Error(`Failed to delete page: ${error.message}`);
  }
}

module.exports = deletePage;
