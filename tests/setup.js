const fs = require('fs-extra');
const path = require('path');
const os = require('os');

// Global test utilities
global.createTempDir = () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tomicz-test-'));
  return tempDir;
};

global.cleanupTempDir = (tempDir) => {
  if (fs.existsSync(tempDir)) {
    fs.removeSync(tempDir);
  }
};

global.installTomiczInDir = async (dir) => {
  const tomiczPath = path.resolve(__dirname, '..');
  const packageJson = require(path.join(tomiczPath, 'package.json'));
  
  // Copy tomicz-cms to temp dir
  await fs.copy(tomiczPath, path.join(dir, 'tomicz-cms'));
  
  // Install dependencies
  const { execSync } = require('child_process');
  execSync('npm install', { cwd: path.join(dir, 'tomicz-cms'), stdio: 'pipe' });
  
  // Install globally in temp dir
  execSync('npm install -g .', { cwd: path.join(dir, 'tomicz-cms'), stdio: 'pipe' });
  
  return path.join(dir, 'tomicz-cms');
};
