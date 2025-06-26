const fs = require('fs');
const path = require('path');

const startDir = process.cwd(); // Çalıştırılan klasör
const outputFile = path.join(startDir, 'alist.txt');

const excludeDirs = ['node_modules'];

function listDir(dir, prefix = '') {
  let result = '';
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Öncelikle klasörleri al, alfabetik sırayla
  const dirs = entries.filter(e => e.isDirectory() && !excludeDirs.includes(e.name)).sort((a,b) => a.name.localeCompare(b.name));
  // Sonra dosyaları al
  const files = entries.filter(e => e.isFile()).sort((a,b) => a.name.localeCompare(b.name));

  for (let i = 0; i < dirs.length; i++) {
    const isLast = i === dirs.length - 1 && files.length === 0;
    result += `${prefix}${isLast ? '└── ' : '├── '}${dirs[i].name}/\n`;
    // Yeni prefix (│ + 4 boşluk) veya (boşluk + 4 boşluk) koy
    const newPrefix = prefix + (isLast ? '    ' : '│   ');
    result += listDir(path.join(dir, dirs[i].name), newPrefix);
  }

  for (let i = 0; i < files.length; i++) {
    const isLast = i === files.length - 1;
    result += `${prefix}${isLast ? '└── ' : '├── '}${files[i].name}\n`;
  }

  return result;
}

const folderName = path.basename(startDir);
const treeString = folderName + '/\n' + listDir(startDir);

fs.writeFileSync(outputFile, treeString, 'utf-8');
console.log(`Dosya yapısı "${outputFile}" dosyasına kaydedildi.`);
