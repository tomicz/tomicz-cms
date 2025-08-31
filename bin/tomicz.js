#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk");
const makePage = require("../commands/make-page");
const deletePage = require("../commands/delete-page");
const listPages = require("../commands/list-pages");
const { initializeTemplates } = require("../utils/helpers");

const program = new Command();

// Set up the CLI
program
  .name("tomicz")
  .description(
    chalk.cyan("Tomicz CMS - Console-based content management system")
  )
  .version("1.0.0", "-v, --version")
  .usage("<command> [options]");

// Make page command
program
  .command("make-page <name>")
  .alias("create")
  .description("Create a new page with HTML, CSS, and JS files")
  .option("-t, --template <template>", "Use specific template")
  .option("-f, --force", "Overwrite existing files")
  .action(async (name, options) => {
    try {
      await makePage(name, options);
    } catch (error) {
      console.error(chalk.red("Error:"), error.message);
      process.exit(1);
    }
  });

// Delete page command
program
  .command("delete-page <name>")
  .alias("remove")
  .description("Delete a page and all associated files")
  .option("-f, --force", "Skip confirmation prompt")
  .action(async (name, options) => {
    try {
      await deletePage(name, options);
    } catch (error) {
      console.error(chalk.red("Error:"), error.message);
      process.exit(1);
    }
  });

// List pages command
program
  .command("list-pages")
  .alias("list")
  .description("List all existing pages with details")
  .option("-s, --simple", "Show simple list only")
  .action(async (options) => {
    try {
      await listPages(options);
    } catch (error) {
      console.error(chalk.red("Error:"), error.message);
      process.exit(1);
    }
  });

// Init command
program
  .command("init")
  .description("Initialize templates directory with default templates")
  .action(async () => {
    try {
      console.log(chalk.cyan("\n🚀 Initializing Tomicz CMS templates...\n"));
      await initializeTemplates();
      console.log(chalk.green("\n✅ Templates initialized successfully!"));
      console.log(chalk.cyan("\n📝 You can now customize the templates in the templates/ directory"));
      console.log(chalk.cyan("💡 Edit templates/pages/page.html, page.css, and page.js to your liking\n"));
    } catch (error) {
      console.error(chalk.red("Error:"), error.message);
      process.exit(1);
    }
  });

// Help command
program
  .command("help")
  .description("Show detailed help information")
  .action(() => {
    console.log(chalk.cyan("\n📚 Tomicz CMS Help\n"));
    console.log(chalk.yellow("Commands:"));
    console.log(
      "  make-page <name>    Create a new page with all necessary files"
    );
    console.log("  delete-page <name>  Delete a page and all associated files");
    console.log("  list-pages          List all existing pages with details");
    console.log("  init                Initialize templates directory");
    console.log("  help                Show this help information");
    console.log("  version             Show version information");
    console.log(chalk.yellow("\nExamples:"));
    console.log("  tomicz init");
    console.log("  tomicz make-page about");
    console.log("  tomicz delete-page about");
    console.log("  tomicz list-pages");
    console.log(chalk.yellow("\nFor more information:"));
    console.log("  https://github.com/tomicz/tomicz-cms\n");
  });

// Handle unknown commands
program.on("command:*", () => {
  console.error(chalk.red("Error: Unknown command"), program.args.join(" "));
  console.log(chalk.yellow("Run tomicz --help for available commands."));
  process.exit(1);
});

// Parse command line arguments
program.parse();
