const owner = 'heyanshul';
const repo = 'heyanshul-service';
const branch = 'main';
const rootPath = 'blogs';

async function fetchTree() {
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    const resp = await fetch(apiUrl);
    const data = await resp.json();
    const entries = data.tree.filter(item =>
      item.type === 'blob' &&
      item.path.startsWith(rootPath + '/') &&
      (item.path.endsWith('.md') || item.path.endsWith('.txt'))
    );

    const tree = {};
    for (const entry of entries) {
      const relative = entry.path.slice(rootPath.length + 1);
      const parts = relative.split('/');
      let current = tree;
      for (let i = 0; i < parts.length; i++) {
        if (i === parts.length - 1) {
          current.__file = entry;
        } else {
          const part = parts[i];
          current[part] = current[part] || {};
          current = current[part];
        }
      }
    }

    const container = document.getElementById('posts');
    buildList(container, tree);
  } catch (err) {
    console.error('Error loading posts:', err);
    document.getElementById('posts').innerText = 'Failed to load blog posts.';
  }
}

function buildList(parent, node) {
  const keys = Object.keys(node).filter(k => k !== '__file');
  const ul = document.createElement('ul');
  parent.appendChild(ul);

  for (const key of keys) {
    const child = node[key];
    const li = document.createElement('li');

    if (child.__file && Object.keys(child).length === 1) {
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = key;
      link.addEventListener('click', e => {
        e.preventDefault();
        loadPost(child.__file.url);
      });
      li.appendChild(link);
    } else {
      if (child.__file) {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = key;
        link.addEventListener('click', e => {
          e.preventDefault();
          loadPost(child.__file.url);
        });
        li.appendChild(link);
      } else {
        li.textContent = key;
      }
      buildList(li, child);
    }
    ul.appendChild(li);
  }
}

async function loadPost(url) {
  const resp = await fetch(url);
  const data = await resp.json();
  let text = '';
  if (data.encoding === 'base64') {
    text = atob(data.content);
  } else {
    text = data.content;
  }
  const content = document.getElementById('post-content');
  content.innerHTML = window.marked ? marked.parse(text) : `<pre>${text}</pre>`;
  content.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', fetchTree);
