const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const {
  validatePageName,
  capitalizeFirst,
  fileExists,
  ensureDirectories,
  generateHtmlTemplate,
  generateCssTemplate,
  generateJsTemplate,
} = require("../utils/helpers");

async function makePage(pageName, options = {}) {
  try {
    // Validate page name
    const validatedName = validatePageName(pageName);
    const capitalizedName = capitalizeFirst(validatedName);

    console.log(
      chalk.cyan(`\n🚀 Creating page: ${chalk.bold(validatedName)}\n`)
    );

    // Ensure directories exist
    await ensureDirectories();

    // Define file paths
    const htmlFile = `../public/pages/${validatedName}.html`;
    const cssFile = `../public/css/pages/${validatedName}.css`;
    const jsFile = `../public/js/pages/${validatedName}.js`;

    // Check if files already exist
    const filesExist = {
      html: await fileExists(htmlFile),
      css: await fileExists(cssFile),
      js: await fileExists(jsFile),
    };

    const anyFileExists = Object.values(filesExist).some((exists) => exists);

    if (anyFileExists && !options.force) {
      console.log(chalk.yellow("⚠️  Some files already exist:"));
      if (filesExist.html) console.log(chalk.yellow(`   📄 ${htmlFile}`));
      if (filesExist.css) console.log(chalk.yellow(`   🎨 ${cssFile}`));
      if (filesExist.js) console.log(chalk.yellow(`   ⚡ ${jsFile}`));

      console.log(chalk.yellow("\nUse --force to overwrite existing files."));
      return;
    }

    // Generate file content
    const htmlContent = generateHtmlTemplate(validatedName, capitalizedName);
    const cssContent = generateCssTemplate(validatedName, capitalizedName);
    const jsContent = generateJsTemplate(validatedName, capitalizedName);

    // Write files
    const filesToWrite = [
      { path: htmlFile, content: htmlContent, type: "HTML" },
      { path: cssFile, content: cssContent, type: "CSS" },
      { path: jsFile, content: jsContent, type: "JavaScript" },
    ];

    for (const file of filesToWrite) {
      await fs.writeFile(file.path, file.content, "utf8");
      console.log(chalk.green(`✅ Created: ${file.path}`));
    }

    // Success message
    console.log(
      chalk.green(`\n🎉 Page "${validatedName}" created successfully!`)
    );
    console.log(chalk.cyan("\n📝 Next steps:"));
    console.log(chalk.white(`   1. Edit ${htmlFile} to add your content`));
    console.log(chalk.white(`   2. Customize ${cssFile} for styling`));
    console.log(chalk.white(`   3. Add functionality in ${jsFile}`));
    console.log(
      chalk.white(`   4. Visit /pages/${validatedName}.html to view your page`)
    );

    // Show file sizes
    console.log(chalk.cyan("\n📊 File sizes:"));
    for (const file of filesToWrite) {
      const stats = await fs.stat(file.path);
      const size = (stats.size / 1024).toFixed(1);
      console.log(chalk.white(`   ${file.type}: ${size} KB`));
    }

    console.log(
      chalk.cyan('\n💡 Tip: Use "tomicz list-pages" to see all your pages\n')
    );
  } catch (error) {
    throw new Error(`Failed to create page: ${error.message}`);
  }
}

module.exports = makePage;
