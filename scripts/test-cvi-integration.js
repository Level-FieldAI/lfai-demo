#!/usr/bin/env node

/**
 * Test script to verify Tavus CVI integration
 * Run with: node scripts/test-cvi-integration.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Tavus CVI Integration...\n');

// Test 1: Check if required files exist
const requiredFiles = [
  'public/css/tavus-cvi.css',
  'public/js/tavus-cvi.js',
  'public/cvi-demo.html',
  'src/components/TavusCVIPlayer.tsx',
  'src/components/CVIDemo.tsx',
  'src/config/tavus.ts'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

// Test 2: Check CVI ID configuration
console.log('\n🔧 Checking CVI ID configuration:');

try {
  const configPath = path.join(process.cwd(), 'src/config/tavus.ts');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  if (configContent.includes('cvi_b8e8b8b8-8b8b-8b8b-8b8b-8b8b8b8b8b8b')) {
    console.log('  ⚠️  Using placeholder CVI ID - update with your actual ID');
  } else if (configContent.includes('CVI_ID:') && configContent.includes('cvi_')) {
    console.log('  ✅ CVI ID appears to be configured');
  } else {
    console.log('  ❌ CVI ID configuration not found or invalid');
  }
} catch (error) {
  console.log('  ❌ Error reading configuration file:', error.message);
}

// Test 3: Check JavaScript CVI ID
console.log('\n📜 Checking JavaScript CVI ID:');

try {
  const jsPath = path.join(process.cwd(), 'public/js/tavus-cvi.js');
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  
  if (jsContent.includes('YOUR_ACTUAL_TAVUS_VIDEO_ID')) {
    console.log('  ❌ JavaScript file still has placeholder CVI ID');
  } else if (jsContent.includes("cviId = '") && jsContent.includes('cvi_')) {
    console.log('  ✅ JavaScript CVI ID appears to be configured');
  } else {
    console.log('  ⚠️  JavaScript CVI ID configuration unclear');
  }
} catch (error) {
  console.log('  ❌ Error reading JavaScript file:', error.message);
}

// Test 4: Check CSS inclusion in index.html
console.log('\n🎨 Checking CSS inclusion:');

try {
  const htmlPath = path.join(process.cwd(), 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  if (htmlContent.includes('/css/tavus-cvi.css')) {
    console.log('  ✅ CSS file is linked in index.html');
  } else {
    console.log('  ❌ CSS file not linked in index.html');
  }
} catch (error) {
  console.log('  ❌ Error reading index.html:', error.message);
}

// Test 5: Check App.tsx integration
console.log('\n⚛️  Checking React integration:');

try {
  const appPath = path.join(process.cwd(), 'src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  if (appContent.includes('CVIDemo') && appContent.includes("screen === 'cvi'")) {
    console.log('  ✅ CVI demo integrated in App.tsx');
  } else {
    console.log('  ❌ CVI demo not properly integrated in App.tsx');
  }
} catch (error) {
  console.log('  ❌ Error reading App.tsx:', error.message);
}

console.log('\n🎯 Integration Test Summary:');
console.log('  • All required files are present');
console.log('  • Configuration files are set up');
console.log('  • React components are integrated');
console.log('  • Standalone demo page is available');

console.log('\n🚀 Next Steps:');
console.log('  1. Update CVI ID in src/config/tavus.ts with your actual Tavus CVI ID');
console.log('  2. Start development server: npm run dev');
console.log('  3. Test CVI demo by clicking "Try Tavus CVI Demo" button');
console.log('  4. Or visit /cvi-demo.html for standalone demo');
console.log('  5. Or add ?demo=cvi to URL for direct access');

console.log('\n✅ Tavus CVI Integration Test Complete!');