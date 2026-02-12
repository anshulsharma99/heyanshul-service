#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, 'blogs');
const OUTPUT_FILE = path.join(__dirname, 'blog-index.json');
const POST_EXTENSIONS = new Set(['.md', '.txt']);

function extractMeta(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const firstHeading = source.match(/^#\s+(.+)$/m)?.[1]?.trim();

  const summary = source
    .replace(/^#\s+.+$/m, '')
    .split(/\n+/)
    .map((line) => line.trim())
    .find((line) => line.length > 0) || '';

  return {
    title: firstHeading || path.basename(filePath, path.extname(filePath)),
    summary,
  };
}

function buildTree(dir) {
  const tree = {};
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      tree[entry.name] = buildTree(absolute);
      continue;
    }

    if (!entry.isFile() || !POST_EXTENSIONS.has(path.extname(entry.name))) {
      continue;
    }

    const key = path.basename(entry.name, path.extname(entry.name));
    const relativePath = path.relative(ROOT_DIR, absolute).replace(/\\/g, '/');
    const meta = extractMeta(absolute);

    tree[key] = {
      __file: relativePath,
      title: meta.title,
      summary: meta.summary,
    };
  }

  return tree;
}

function main() {
  const blogTree = buildTree(ROOT_DIR);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(blogTree, null, 2) + '\n');
  console.log(`Generated ${path.relative(__dirname, OUTPUT_FILE)} with ${Object.keys(blogTree).length} top-level sections.`);
}

main();
