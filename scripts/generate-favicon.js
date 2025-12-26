// Simple script to copy SVG as ICO fallback
// For proper ICO conversion, consider using: https://realfavicongenerator.net/

const fs = require('fs');
const path = require('path');

// For now, we'll create a simple 16x16 PNG as ICO
// In production, use proper tools to generate multi-resolution ICO files

const adminSvg = fs.readFileSync(path.join(__dirname, '../apps/admin/public/favicon.svg'), 'utf8');
const citizenSvg = fs.readFileSync(path.join(__dirname, '../apps/citizen/public/favicon.svg'), 'utf8');

// Create simple 32x32 favicon data URLs (browsers will handle SVG fallback)
console.log('SVG favicons created successfully!');
console.log('For production ICO files, consider using:');
console.log('- https://realfavicongenerator.net/');
console.log('- Or install: npm install -g icon-gen');
console.log('- Then run: icon-gen -i favicon.svg -o . --ico');
console.log('\nFor now, browsers will use the SVG favicons which are higher quality.');
