const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'blogs');

function buildTree(dir) {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name));
  const node = {};
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      node[entry.name] = buildTree(fullPath);
    } else if (entry.isFile() && /(\.md|\.txt)$/.test(entry.name)) {
      const name = entry.name.replace(/\.(md|txt)$/, '');
      node[name] = { __file: path.relative(rootDir, fullPath).replace(/\\/g, '/') };
    }
  }
  return node;
}

const tree = buildTree(rootDir);
// Ensure a trailing newline for cleaner diffs and easier merges
const outputPath = path.join(__dirname, 'blog-index.json');
fs.writeFileSync(outputPath, JSON.stringify(tree, null, 2) + '\n');

// Also generate a JavaScript version for environments where fetching local
// files is restricted (e.g. when opening pages via the file protocol).
const jsOutputPath = path.join(__dirname, 'blog-index.js');
fs.writeFileSync(
  jsOutputPath,
  `window.blogIndex = ${JSON.stringify(tree, null, 2)};\n`
);
