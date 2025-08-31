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

    console.log(
      chalk.cyan(`\n🗑️  Deleting page: ${chalk.bold(validatedName)}\n`)
    );

    // Define file paths
    const htmlFile = `../public/pages/${validatedName}.html`;
    const cssFile = `../public/css/pages/${validatedName}.css`;
    const jsFile = `../public/js/pages/${validatedName}.js`;

    // Check if page exists
    if (!(await fileExists(htmlFile))) {
      const availablePages = await getAvailablePages();

      if (availablePages.length === 0) {
        throw new Error("No pages found in ../public/pages/ directory");
      }

      console.log(chalk.red(`❌ Page "${validatedName}" not found!`));
      console.log(chalk.yellow("\n📄 Available pages:"));
      availablePages.forEach((page) => {
        console.log(chalk.white(`   • ${page}`));
      });
      console.log(
        chalk.cyan(
          '\n💡 Tip: Use "tomicz list-pages" to see all pages with details\n'
        )
      );
      return;
    }

    // Get file information
    const filesToCheck = [
      { path: htmlFile, type: "HTML" },
      { path: cssFile, type: "CSS" },
      { path: jsFile, type: "JavaScript" },
    ];

    console.log(chalk.yellow("📄 Files to delete:"));

    let totalSize = 0;
    const existingFiles = [];

    for (const file of filesToCheck) {
      if (await fileExists(file.path)) {
        const stats = await getFileStats(file.path);
        if (stats) {
          console.log(chalk.white(`   ${file.type}: ${file.path}`));
          console.log(
            chalk.gray(
              `      Size: ${stats.size} | Modified: ${stats.modified}`
            )
          );
          existingFiles.push(file);
          totalSize += stats.size;
        }
      }
    }

    if (existingFiles.length === 0) {
      console.log(chalk.yellow("   No files found to delete"));
      return;
    }

    console.log(
      chalk.yellow(`\n📊 Total size: ${(totalSize / 1024).toFixed(1)} KB`)
    );

    // Confirm deletion
    if (!options.force) {
      const confirmed = await confirmAction(
        chalk.red(
          `\n⚠️  Are you sure you want to delete "${validatedName}" and all its files?`
        ),
        false
      );

      if (!confirmed) {
        console.log(chalk.yellow("❌ Deletion cancelled\n"));
        return;
      }
    }

    // Delete files
    console.log(chalk.cyan("\n🗑️  Deleting files..."));

    for (const file of existingFiles) {
      try {
        await fs.remove(file.path);
        console.log(chalk.green(`✅ Deleted: ${file.path}`));
      } catch (error) {
        console.log(chalk.red(`❌ Failed to delete: ${file.path}`));
        console.log(chalk.gray(`   Error: ${error.message}`));
      }
    }

    // Success message
    console.log(
      chalk.green(`\n🎉 Page "${validatedName}" deleted successfully!`)
    );
    console.log(
      chalk.cyan(`📊 Freed up: ${(totalSize / 1024).toFixed(1)} KB of space`)
    );

    // Show remaining pages
    const remainingPages = await getAvailablePages();
    if (remainingPages.length > 0) {
      console.log(chalk.cyan(`\n📄 Remaining pages: ${remainingPages.length}`));
      console.log(
        chalk.cyan('💡 Use "tomicz list-pages" to see all remaining pages\n')
      );
    } else {
      console.log(chalk.cyan("\n📄 No pages remaining"));
      console.log(
        chalk.cyan('💡 Use "tomicz make-page <name>" to create a new page\n')
      );
    }
  } catch (error) {
    throw new Error(`Failed to delete page: ${error.message}`);
  }
}

module.exports = deletePage;
