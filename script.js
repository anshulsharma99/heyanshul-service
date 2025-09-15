const rootPath = 'blogs';

async function fetchTree() {
  try {
    const resp = await fetch('blog-index.json');
    const tree = await resp.json();
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
        loadPost(child.__file);
      });
      li.appendChild(link);
    } else {
      if (child.__file) {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = key;
        link.addEventListener('click', e => {
          e.preventDefault();
          loadPost(child.__file);
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

async function loadPost(path) {
  const resp = await fetch(`${rootPath}/${path}`);
  const text = await resp.text();
  const content = document.getElementById('post-content');
  content.innerHTML = window.marked ? marked.parse(text) : `<pre>${text}</pre>`;
  content.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', fetchTree);
