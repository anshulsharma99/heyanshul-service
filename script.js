window.addEventListener('DOMContentLoaded', () => {
  fetch('posts.json')
    .then(resp => resp.json())
    .then(posts => {
      const container = document.getElementById('posts');
      posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'post';
        article.innerHTML = `
          <h3>${post.title}</h3>
          <small>${post.date}</small>
          <p>${post.content}</p>
        `;
        container.appendChild(article);
      });
    })
    .catch(err => {
      console.error('Error loading posts:', err);
      document.getElementById('posts').innerText = 'Failed to load blog posts.';
    });
});
