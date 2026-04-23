const fs = require('fs');
const path = require('path');
const https = require('https');

const mockDir = path.join(__dirname, 'public', 'mock');
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
}

const mockDataPath = path.join(__dirname, 'src', 'lib', 'mock-data.ts');
let data = fs.readFileSync(mockDataPath, 'utf8');

const regex = /image:\s*"\/mock\/([^"]+)\.svg"/g;
let match;
const imagesToDownload = new Set();
while ((match = regex.exec(data)) !== null) {
  imagesToDownload.add(match[1]);
}

const downloadImage = (name, index) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(mockDir, `${name}.jpg`);
    const url = `https://loremflickr.com/800/600/electronics,component?random=${index}`;
    
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        let loc = res.headers.location;
        if (loc.startsWith('/')) loc = 'https://loremflickr.com' + loc;
        https.get(loc, (res2) => {
          const file = fs.createWriteStream(filePath);
          res2.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded: ${name}.jpg`);
            resolve();
          });
        }).on('error', reject);
      } else {
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${name}.jpg`);
          resolve();
        });
      }
    }).on('error', reject);
  });
};

async function run() {
  console.log(`Found ${imagesToDownload.size} SVG placeholders to replace with real photos.`);
  let idx = 0;
  for (const name of imagesToDownload) {
    try {
      await downloadImage(name, idx++);
    } catch (e) {
      console.error(`Failed to download ${name}:`, e);
    }
  }

  // Update mock-data.ts
  data = data.replace(/\.svg/g, '.jpg');
  fs.writeFileSync(mockDataPath, data);
  console.log('Done downloading images and updating mock-data.ts!');
}

run();
