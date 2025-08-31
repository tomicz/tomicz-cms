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
    console.log(chalk.cyan("\n📄 Tomicz CMS - Page Listing\n"));

    // Get all pages
    const pages = await getAvailablePages();

    if (pages.length === 0) {
      console.log(chalk.yellow("📁 No pages found in public/pages/ directory"));
      console.log(
        chalk.cyan(
          '\n💡 Use "tomicz make-page <name>" to create your first page\n'
        )
      );
      return;
    }

    // Simple list mode
    if (options.simple) {
      console.log(chalk.yellow(`Found ${pages.length} page(s):\n`));
      pages.forEach((page) => {
        console.log(chalk.white(`   • ${page}`));
      });
      console.log(
        chalk.cyan(
          '\n💡 Use "tomicz list-pages" (without --simple) for detailed information\n'
        )
      );
      return;
    }

    // Detailed list mode
    console.log(
      chalk.yellow(`📊 Found ${pages.length} page(s) in public/pages/:\n`)
    );

    let totalSize = 0;
    let totalFiles = 0;

    for (const page of pages) {
      const htmlFile = `../public/pages/${page}.html`;
      const cssFile = `../public/css/pages/${page}.css`;
      const jsFile = `../public/js/pages/${page}.js`;

      console.log(chalk.cyan(`📄 ${chalk.bold(page)}`));

      // HTML file info
      if (await fileExists(htmlFile)) {
        const htmlStats = await getFileStats(htmlFile);
        if (htmlStats) {
          console.log(chalk.white(`   📄 HTML: ${htmlFile}`));
          console.log(
            chalk.gray(
              `      Size: ${htmlStats.size} | Modified: ${htmlStats.modified}`
            )
          );
          console.log(chalk.gray(`      URL: /pages/${page}.html`));
          totalSize += htmlStats.size;
          totalFiles++;
        }
      }

      // CSS file info
      if (await fileExists(cssFile)) {
        const cssStats = await getFileStats(cssFile);
        if (cssStats) {
          console.log(chalk.white(`   🎨 CSS: ${cssFile}`));
          console.log(
            chalk.gray(
              `      Size: ${cssStats.size} | Modified: ${cssStats.modified}`
            )
          );
          totalSize += cssStats.size;
          totalFiles++;
        }
      }

      // JavaScript file info
      if (await fileExists(jsFile)) {
        const jsStats = await getFileStats(jsFile);
        if (jsStats) {
          console.log(chalk.white(`   ⚡ JavaScript: ${jsFile}`));
          console.log(
            chalk.gray(
              `      Size: ${jsStats.size} | Modified: ${jsStats.modified}`
            )
          );
          totalSize += jsStats.size;
          totalFiles++;
        }
      }

      // Check for missing files
      const missingFiles = [];
      if (!(await fileExists(cssFile))) missingFiles.push("CSS");
      if (!(await fileExists(jsFile))) missingFiles.push("JavaScript");

      if (missingFiles.length > 0) {
        console.log(
          chalk.yellow(`   ⚠️  Missing: ${missingFiles.join(", ")} file(s)`)
        );
      }

      console.log(""); // Empty line between pages
    }

    // Summary
    console.log(chalk.cyan("📊 Summary:"));
    console.log(chalk.white(`   Total pages: ${pages.length}`));
    console.log(chalk.white(`   Total files: ${totalFiles}`));
    console.log(
      chalk.white(`   Total size: ${(totalSize / 1024).toFixed(1)} KB`)
    );

    // Quick actions
    console.log(chalk.cyan("\n💡 Quick actions:"));
    console.log(
      chalk.white(`   • tomicz make-page <name>     - Create a new page`)
    );
    console.log(
      chalk.white(`   • tomicz delete-page <name>   - Delete a page`)
    );
    console.log(
      chalk.white(`   • tomicz list-pages --simple  - Show simple list`)
    );
    console.log(
      chalk.white(`   • tomicz help                 - Show help information\n`)
    );
  } catch (error) {
    throw new Error(`Failed to list pages: ${error.message}`);
  }
}

module.exports = listPages;
