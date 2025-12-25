#!/usr/bin/env node

/**
 * Build all applications in the workspace
 * Usage: node scripts/build-all.js
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const apps = ['apps/admin', 'apps/citizen', 'apps/backend'];

console.log('🏗️  Building all applications...\n');

let allSucceeded = true;

for (const app of apps) {
  const appName = app.split('/')[1];
  
  if (!existsSync(app)) {
    console.log(`⚠️  ${appName}: Directory not found, skipping...`);
    continue;
  }

  try {
    console.log(`📦 Building ${appName}...`);
    execSync(`npm run build --workspace=${app}`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log(`✅ ${appName}: Build completed\n`);
  } catch (error) {
    console.error(`❌ ${appName}: Build failed\n`);
    allSucceeded = false;
  }
}

if (allSucceeded) {
  console.log('✨ All builds completed successfully!');
  process.exit(0);
} else {
  console.log('⚠️  Some builds failed. Check the errors above.');
  process.exit(1);
}
