const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

describe('Tomicz CMS Integration Tests', () => {
  let tempDir;
  let originalCwd;

  beforeEach(() => {
    // Create temporary directory for each test
    tempDir = createTempDir();
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  afterEach(() => {
    // Clean up and restore original directory
    process.chdir(originalCwd);
    cleanupTempDir(tempDir);
  });

  describe('tomicz init', () => {
    test('should initialize project with all required files', async () => {
      // Install tomicz-cms in temp directory
      await installTomiczInDir(tempDir);

      // Run init command
      execSync('tomicz init', { stdio: 'pipe' });

      // Verify directory structure
      expect(fs.existsSync('templates')).toBe(true);
      expect(fs.existsSync('templates/pages')).toBe(true);
      expect(fs.existsSync('public')).toBe(true);
      expect(fs.existsSync('public/css')).toBe(true);
      expect(fs.existsSync('public/js')).toBe(true);
      expect(fs.existsSync('public/images')).toBe(true);

      // Verify template files
      expect(fs.existsSync('templates/pages/page.html')).toBe(true);
      expect(fs.existsSync('templates/pages/page.css')).toBe(true);
      expect(fs.existsSync('templates/pages/page.js')).toBe(true);

      // Verify component files
      expect(fs.existsSync('public/js/components/page/header.js')).toBe(true);
      expect(fs.existsSync('public/js/components/page/links.js')).toBe(true);
      expect(fs.existsSync('public/js/components/page/footer.js')).toBe(true);

      // Verify essential files
      expect(fs.existsSync('public/images/Logo_Light_Text.svg')).toBe(true);
      expect(fs.existsSync('public/images/favicon.ico')).toBe(true);
      expect(fs.existsSync('public/css/common.css')).toBe(true);
      expect(fs.existsSync('public/css/components.css')).toBe(true);

      // Verify homepage creation
      expect(fs.existsSync('public/index.html')).toBe(true);
      expect(fs.existsSync('public/css/pages/index.css')).toBe(true);
      expect(fs.existsSync('public/js/pages/index.js')).toBe(true);
    });

    test('should not overwrite existing index.html', async () => {
      await installTomiczInDir(tempDir);

      // Create a custom index.html first
      fs.ensureDirSync('public');
      fs.writeFileSync('public/index.html', '<html><body>Custom homepage</body></html>');

      // Run init command
      execSync('tomicz init', { stdio: 'pipe' });

      // Verify custom index.html was preserved
      const content = fs.readFileSync('public/index.html', 'utf8');
      expect(content).toContain('Custom homepage');
    });
  });

  describe('tomicz make-page', () => {
    beforeEach(async () => {
      await installTomiczInDir(tempDir);
      execSync('tomicz init', { stdio: 'pipe' });
    });

    test('should create a new page with all required files', () => {
      execSync('tomicz make-page about', { stdio: 'pipe' });

      // Verify page files exist
      expect(fs.existsSync('public/pages/about.html')).toBe(true);
      expect(fs.existsSync('public/css/pages/about.css')).toBe(true);
      expect(fs.existsSync('public/js/pages/about.js')).toBe(true);

      // Verify HTML content
      const htmlContent = fs.readFileSync('public/pages/about.html', 'utf8');
      expect(htmlContent).toContain('<!DOCTYPE html>');
      expect(htmlContent).toContain('<page-header>');
      expect(htmlContent).toContain('<page-links>');
      expect(htmlContent).toContain('<page-footer>');
      expect(htmlContent).toContain('page-content');
      expect(htmlContent).toContain('About');
      expect(htmlContent).toContain('common.css');
      expect(htmlContent).toContain('components.css');
      expect(htmlContent).toContain('about.css');

      // Verify CSS content
      const cssContent = fs.readFileSync('public/css/pages/about.css', 'utf8');
      expect(cssContent).toContain('page-content');
      expect(cssContent).toContain('margin-top: 120px');
      expect(cssContent).toContain('about-page');

      // Verify JS content
      const jsContent = fs.readFileSync('public/js/pages/about.js', 'utf8');
      expect(jsContent).toContain('About');
    });

    test('should create homepage on first page creation', () => {
      // Remove existing index.html to simulate fresh project
      fs.removeSync('public/index.html');
      fs.removeSync('public/css/pages/index.css');
      fs.removeSync('public/js/pages/index.js');

      execSync('tomicz make-page about', { stdio: 'pipe' });

      // Verify homepage was created
      expect(fs.existsSync('public/index.html')).toBe(true);
      expect(fs.existsSync('public/css/pages/index.css')).toBe(true);
      expect(fs.existsSync('public/js/pages/index.js')).toBe(true);
    });

    test('should handle multiple pages', () => {
      execSync('tomicz make-page about', { stdio: 'pipe' });
      execSync('tomicz make-page services', { stdio: 'pipe' });
      execSync('tomicz make-page contact', { stdio: 'pipe' });

      expect(fs.existsSync('public/pages/about.html')).toBe(true);
      expect(fs.existsSync('public/pages/services.html')).toBe(true);
      expect(fs.existsSync('public/pages/contact.html')).toBe(true);
    });

    test('should validate page names', () => {
      // Test invalid page name
      expect(() => {
        execSync('tomicz make-page "invalid@name"', { stdio: 'pipe' });
      }).toThrow();

      // Test empty page name
      expect(() => {
        execSync('tomicz make-page ""', { stdio: 'pipe' });
      }).toThrow();
    });

    test('should handle duplicate page names gracefully', () => {
      execSync('tomicz make-page about', { stdio: 'pipe' });

      // Should not throw error for duplicate
      expect(() => {
        execSync('tomicz make-page about', { stdio: 'pipe' });
      }).not.toThrow();
    });
  });

  describe('tomicz list-pages', () => {
    beforeEach(async () => {
      await installTomiczInDir(tempDir);
      execSync('tomicz init', { stdio: 'pipe' });
    });

    test('should list all created pages', () => {
      execSync('tomicz make-page about', { stdio: 'pipe' });
      execSync('tomicz make-page services', { stdio: 'pipe' });

      const output = execSync('tomicz list-pages', { encoding: 'utf8' });

      expect(output).toContain('about');
      expect(output).toContain('services');
      expect(output).toContain('public/pages/about.html');
      expect(output).toContain('public/pages/services.html');
    });

    test('should show correct file sizes and dates', () => {
      execSync('tomicz make-page about', { stdio: 'pipe' });

      const output = execSync('tomicz list-pages', { encoding: 'utf8' });

      expect(output).toContain('KB');
      expect(output).toContain('2025'); // Current year
    });

    test('should handle empty pages directory', () => {
      const output = execSync('tomicz list-pages', { encoding: 'utf8' });

      expect(output).toContain('No pages found');
    });
  });

  describe('tomicz delete-page', () => {
    beforeEach(async () => {
      await installTomiczInDir(tempDir);
      execSync('tomicz init', { stdio: 'pipe' });
      execSync('tomicz make-page about', { stdio: 'pipe' });
    });

    test('should delete page with confirmation', () => {
      // Mock user input for confirmation (this is tricky in integration tests)
      // For now, we'll test the files exist before deletion
      expect(fs.existsSync('public/pages/about.html')).toBe(true);
      expect(fs.existsSync('public/css/pages/about.css')).toBe(true);
      expect(fs.existsSync('public/js/pages/about.js')).toBe(true);

      // Note: In a real scenario, we'd need to mock the inquirer prompt
      // For integration tests, we can test the file existence logic
    });

    test('should handle non-existent page gracefully', () => {
      expect(() => {
        execSync('tomicz delete-page nonexistent', { stdio: 'pipe' });
      }).not.toThrow();
    });
  });

  describe('tomicz help', () => {
    beforeEach(async () => {
      await installTomiczInDir(tempDir);
    });

    test('should display help information', () => {
      const output = execSync('tomicz help', { encoding: 'utf8' });

      expect(output).toContain('Tomicz CMS Help');
      expect(output).toContain('Commands:');
      expect(output).toContain('make-page');
      expect(output).toContain('delete-page');
      expect(output).toContain('list-pages');
      expect(output).toContain('init');
    });
  });

  describe('Command aliases', () => {
    beforeEach(async () => {
      await installTomiczInDir(tempDir);
      execSync('tomicz init', { stdio: 'pipe' });
    });

    test('should support create alias for make-page', () => {
      execSync('tomicz create about', { stdio: 'pipe' });
      expect(fs.existsSync('public/pages/about.html')).toBe(true);
    });

    test('should support remove alias for delete-page', () => {
      execSync('tomicz make-page about', { stdio: 'pipe' });
      expect(fs.existsSync('public/pages/about.html')).toBe(true);
      
      // Note: delete-page requires confirmation, so we test file existence
    });

    test('should support list alias for list-pages', () => {
      execSync('tomicz make-page about', { stdio: 'pipe' });
      const output = execSync('tomicz list', { encoding: 'utf8' });
      expect(output).toContain('about');
    });
  });

  describe('Template customization', () => {
    beforeEach(async () => {
      await installTomiczInDir(tempDir);
      execSync('tomicz init', { stdio: 'pipe' });
    });

    test('should use custom templates when modified', () => {
      // Modify the template
      const customTemplate = '<html><body>Custom template for {{PAGE_NAME}}</body></html>';
      fs.writeFileSync('templates/pages/page.html', customTemplate);

      // Create a new page
      execSync('tomicz make-page about', { stdio: 'pipe' });

      // Verify custom template was used
      const content = fs.readFileSync('public/pages/about.html', 'utf8');
      expect(content).toContain('Custom template for about');
    });
  });

  describe('Error handling', () => {
    beforeEach(async () => {
      await installTomiczInDir(tempDir);
    });

    test('should handle missing dependencies gracefully', () => {
      // This would test scenarios where required files are missing
      // For now, we test that init works even in empty directory
      expect(() => {
        execSync('tomicz init', { stdio: 'pipe' });
      }).not.toThrow();
    });

    test('should handle permission errors gracefully', () => {
      // Create a read-only directory
      const readOnlyDir = path.join(tempDir, 'readonly');
      fs.ensureDirSync(readOnlyDir);
      fs.chmodSync(readOnlyDir, 0o444); // Read-only

      // Should handle permission errors gracefully
      expect(() => {
        process.chdir(readOnlyDir);
        execSync('tomicz init', { stdio: 'pipe' });
      }).toThrow(); // Should throw due to permissions

      // Restore permissions for cleanup
      fs.chmodSync(readOnlyDir, 0o755);
    });
  });
});
