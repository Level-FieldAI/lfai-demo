#!/usr/bin/env node

/**
 * R2 Setup Helper Script
 * 
 * This script helps set up the environment variables for Cloudflare R2 integration.
 * Run with: node scripts/setup-r2.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const envPath = path.join(projectRoot, '.env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function readEnvFile() {
  try {
    if (fs.existsSync(envPath)) {
      return fs.readFileSync(envPath, 'utf8');
    }
    return '';
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return '';
  }
}

function writeEnvFile(content) {
  try {
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('✅ .env file updated successfully!');
  } catch (error) {
    console.error('❌ Error writing .env file:', error.message);
  }
}

function updateEnvVariable(content, key, value) {
  const lines = content.split('\n');
  const keyPattern = new RegExp(`^${key}=`);
  let found = false;
  
  const updatedLines = lines.map(line => {
    if (keyPattern.test(line)) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });
  
  if (!found) {
    updatedLines.push(`${key}=${value}`);
  }
  
  return updatedLines.join('\n');
}

async function main() {
  console.log('🚀 Cloudflare R2 Setup Helper\n');
  
  console.log('This script will help you configure environment variables for Cloudflare R2 integration.\n');
  
  console.log('📋 Prerequisites:');
  console.log('1. Cloudflare account with R2 enabled');
  console.log('2. R2 bucket created (recommended: "lfai-video-demo")');
  console.log('3. R2 API token with appropriate permissions\n');
  
  const proceed = await question('Do you want to continue? (y/N): ');
  if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }
  
  console.log('\n🔑 R2 API Credentials');
  console.log('You can find these in your Cloudflare Dashboard → R2 → Manage R2 API tokens\n');
  
  const accessKeyId = await question('Enter your R2 Access Key ID: ');
  if (!accessKeyId.trim()) {
    console.log('❌ Access Key ID is required. Setup cancelled.');
    rl.close();
    return;
  }
  
  const secretAccessKey = await question('Enter your R2 Secret Access Key: ');
  if (!secretAccessKey.trim()) {
    console.log('❌ Secret Access Key is required. Setup cancelled.');
    rl.close();
    return;
  }
  
  console.log('\n📝 Updating .env file...');
  
  let envContent = readEnvFile();
  
  // Add R2 configuration section if not present
  if (!envContent.includes('# Cloudflare R2 Configuration')) {
    envContent += '\n# Cloudflare R2 Configuration\n';
  }
  
  envContent = updateEnvVariable(envContent, 'VITE_R2_ACCESS_KEY_ID', accessKeyId.trim());
  envContent = updateEnvVariable(envContent, 'VITE_R2_SECRET_ACCESS_KEY', secretAccessKey.trim());
  
  writeEnvFile(envContent);
  
  console.log('\n✅ Setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Restart your development server (npm run dev)');
  console.log('2. Open the application and go to Video Manager → R2 Setup');
  console.log('3. Test the R2 connection');
  console.log('4. Run the video migration if needed');
  console.log('\n📖 For detailed instructions, see: R2_MIGRATION_GUIDE.md');
  
  rl.close();
}

main().catch(error => {
  console.error('❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});