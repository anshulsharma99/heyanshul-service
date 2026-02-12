const ROOT_PATH = 'blogs';

const state = {
  index: null,
  posts: [],
};

const dom = {
  nav: document.getElementById('posts'),
  content: document.getElementById('post-content'),
  meta: document.getElementById('post-meta'),
  search: document.getElementById('search'),
};

function collectPosts(node, trail = []) {
  const entries = Object.entries(node || {});
  for (const [name, value] of entries) {
    if (value && typeof value === 'object' && value.__file) {
      state.posts.push({
        title: value.title || name,
        path: value.__file,
        summary: value.summary || '',
        trail: [...trail, name],
      });
    }
    if (value && typeof value === 'object') {
      const children = Object.fromEntries(
        Object.entries(value).filter(([key]) => !key.startsWith('__') && !['title', 'summary'].includes(key))
      );
      if (Object.keys(children).length > 0) {
        collectPosts(children, [...trail, name]);
      }
    }
  }
}

function renderTree(node, parent, filter = '') {
  parent.innerHTML = '';
  const ul = document.createElement('ul');
  parent.appendChild(ul);

  for (const [name, value] of Object.entries(node)) {
    const li = document.createElement('li');
    const isPost = Boolean(value?.__file);

    if (isPost) {
      const searchable = `${name} ${value.title || ''} ${value.summary || ''} ${value.__file}`.toLowerCase();
      if (filter && !searchable.includes(filter)) {
        continue;
      }
      li.className = 'post';
      const link = document.createElement('a');
      link.href = `#${encodeURIComponent(value.__file)}`;
      link.textContent = value.title || name;
      link.title = value.summary || value.__file;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        loadPost(value.__file, value.title || name, value.summary || '', [name]);
      });
      li.appendChild(link);
      ul.appendChild(li);
      continue;
    }

    const nested = document.createElement('div');
    li.className = 'folder';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `▾ ${name}`;
    button.addEventListener('click', () => {
      const hidden = nested.style.display === 'none';
      nested.style.display = hidden ? '' : 'none';
      button.textContent = `${hidden ? '▾' : '▸'} ${name}`;
    });

    renderTree(value, nested, filter);
    if (!nested.querySelector('li')) {
      continue;
    }

    li.append(button, nested);
    ul.appendChild(li);
  }
}

async function loadPost(path, title = path, summary = '', localTrail = []) {
  const response = await fetch(`${ROOT_PATH}/${path}`);
  if (!response.ok) {
    dom.meta.textContent = `Could not load ${path}`;
    dom.content.textContent = 'Request failed. Please verify the blog file exists.';
    return;
  }

  const markdown = await response.text();
  dom.content.innerHTML = window.marked ? marked.parse(markdown) : `<pre>${markdown}</pre>`;
  const trail = localTrail.length > 0 ? localTrail.join(' / ') : path;
  dom.meta.textContent = `${trail}${summary ? ` · ${summary}` : ''}`;
  history.replaceState(null, '', `#${encodeURIComponent(path)}`);
}

function findPostByPath(path) {
  return state.posts.find((post) => post.path === path);
}

function render(filter = '') {
  renderTree(state.index, dom.nav, filter.toLowerCase().trim());
  if (!dom.nav.querySelector('li')) {
    dom.nav.innerHTML = '<p class="empty">No posts match your search.</p>';
  }
}

async function init() {
  if (!dom.nav) {
    return;
  }

  try {
    const response = await fetch('blog-index.json');
    state.index = await response.json();
    state.posts = [];
    collectPosts(state.index);
    render();

    const hashPath = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (hashPath) {
      const selected = findPostByPath(hashPath);
      if (selected) {
        await loadPost(selected.path, selected.title, selected.summary, selected.trail);
      }
    }

    dom.search?.addEventListener('input', (event) => render(event.target.value));
  } catch (error) {
    console.error(error);
    dom.nav.innerHTML = '<p class="empty">Failed to load blog index.</p>';
  }
}

document.addEventListener('DOMContentLoaded', init);
