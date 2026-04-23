const fs = require('fs');
const path = require('path');

const mockDir = path.join(__dirname, 'public', 'mock');
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
}

const mockDataPath = path.join(__dirname, 'src', 'lib', 'mock-data.ts');
const data = fs.readFileSync(mockDataPath, 'utf8');

const regex = /image:\s*"\/mock\/([^"]+)"/g;
let match;
const images = new Set();
while ((match = regex.exec(data)) !== null) {
  images.add(match[1]);
}

images.forEach(img => {
  // Only process .svg
  if (!img.endsWith('.svg')) return;

  const filePath = path.join(mockDir, img);
  if (fs.existsSync(filePath)) {
    console.log(`Skipping existing: ${img}`);
    return;
  }
  
  const name = img.replace(/\.svg$/, '').replace(/-/g, ' ').toUpperCase();
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#09090b"/>
    <rect x="50" y="50" width="700" height="500" rx="30" fill="#18181b" stroke="#8b5cf6" stroke-width="2"/>
    <!-- Glow effect -->
    <rect x="50" y="50" width="700" height="500" rx="30" fill="none" stroke="#38bdf8" stroke-width="8" opacity="0.1"/>
    
    <text x="400" y="300" font-family="monospace" font-size="42" font-weight="bold" fill="#fafafa" text-anchor="middle" dominant-baseline="middle">${name}</text>
    <text x="400" y="360" font-family="monospace" font-size="20" fill="#a1a1aa" text-anchor="middle" dominant-baseline="middle">Dystronic Component</text>
    
    <circle cx="400" cy="180" r="30" fill="none" stroke="#34d399" stroke-width="4" opacity="0.7"/>
    <path d="M 385 180 L 415 180 M 400 165 L 400 195" stroke="#34d399" stroke-width="4" opacity="0.7"/>
  </svg>`;
  
  fs.writeFileSync(filePath, svg);
  console.log(`Generated: ${img}`);
});
console.log('Done generating SVG placeholders!');
