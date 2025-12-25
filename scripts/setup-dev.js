#!/usr/bin/env node

/**
 * Setup development environment
 * Usage: node scripts/setup-dev.js
 */

import { execSync } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🚀 MyFamilyLink Development Setup\n');

  // Check Node version
  const nodeVersion = process.version.match(/^v(\d+)/)[1];
  if (parseInt(nodeVersion) < 18) {
    console.error('❌ Node.js 18 or higher is required');
    process.exit(1);
  }
  console.log('✅ Node.js version:', process.version);

  // Check for required tools
  const tools = ['npm', 'git', 'pg_config'];
  for (const tool of tools) {
    try {
      execSync(`${tool} --version`, { stdio: 'ignore' });
      console.log(`✅ ${tool} is installed`);
    } catch {
      console.warn(`⚠️  ${tool} not found (may be required)`);
    }
  }

  // Copy .env.example if .env doesn't exist
  if (!existsSync('.env')) {
    console.log('\n📝 Setting up environment variables...');
    copyFileSync('.env.example', '.env');
    console.log('✅ Created .env from .env.example');
    console.log('⚠️  Please edit .env file with your configuration');
  } else {
    console.log('✅ .env file already exists');
  }

  // Ask to install dependencies
  const installDeps = await question('\n📦 Install dependencies? (y/n): ');
  if (installDeps.toLowerCase() === 'y') {
    console.log('Installing dependencies...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependencies installed');
    } catch (error) {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  }

  // Ask to setup database
  const setupDb = await question('\n🗄️  Setup database? (y/n): ');
  if (setupDb.toLowerCase() === 'y') {
    const dbUrl = await question('Enter DATABASE_URL (or press Enter to skip): ');
    if (dbUrl) {
      try {
        console.log('Running database migrations...');
        execSync('npm run db:migrate --workspace=apps/backend', { 
          stdio: 'inherit',
          env: { ...process.env, DATABASE_URL: dbUrl }
        });
        console.log('✅ Database setup completed');
      } catch (error) {
        console.error('❌ Database setup failed');
      }
    }
  }

  console.log('\n✨ Setup completed!\n');
  console.log('Next steps:');
  console.log('1. Edit .env file with your configuration');
  console.log('2. Start PostgreSQL and Redis');
  console.log('3. Run: npm run dev');
  console.log('\nHappy coding! 🎉\n');

  rl.close();
}

setup().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});
