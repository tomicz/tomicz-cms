const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const {
  getAvailablePages,
  getFileStats,
  fileExists,
} = require("../utils/helpers");

async function listPages(options = {}) {
  try {
    // Get all pages
    const pages = await getAvailablePages();

    if (pages.length === 0) {
      return;
    }

    // Simple list mode
    if (options.simple) {
      pages.forEach((page) => {});
      return;
    }

    // Detailed list mode
    console.log(
      chalk.yellow(`Found ${pages.length} page(s) in public/pages/:\n`)
    );

    let totalSize = 0;
    let totalFiles = 0;

    for (const page of pages) {
      const htmlFile = `public/pages/${page}.html`;
      const cssFile = `public/css/pages/${page}.css`;
      const jsFile = `public/js/pages/${page}.js`;

      console.log(chalk.cyan(`${chalk.bold(page)}`));

      // HTML file info
      if (await fileExists(htmlFile)) {
        const htmlStats = await getFileStats(htmlFile);
        if (htmlStats) {
          totalSize += htmlStats.size;
          totalFiles++;
        }
      }

      // CSS file info
      if (await fileExists(cssFile)) {
        const cssStats = await getFileStats(cssFile);
        if (cssStats) {
          totalSize += cssStats.size;
          totalFiles++;
        }
      }

      // JavaScript file info
      if (await fileExists(jsFile)) {
        const jsStats = await getFileStats(jsFile);
        if (jsStats) {
          totalSize += jsStats.size;
          totalFiles++;
        }
      }

      // Check for missing files
      const missingFiles = [];
      if (!(await fileExists(cssFile))) missingFiles.push("CSS");
      if (!(await fileExists(jsFile))) missingFiles.push("JavaScript");

      if (missingFiles.length > 0) {
      }
    }

    // Summary
  } catch (error) {
    throw new Error(`Failed to list pages: ${error.message}`);
  }
}

module.exports = listPages;
