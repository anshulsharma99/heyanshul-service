fetch('data.json')
  .then(resp => resp.json())
  .then(data => {
    document.getElementById('site-title').textContent = data.siteTitle;
    document.getElementById('tagline').textContent = data.tagline;
    document.getElementById('about-heading').textContent = data.aboutHeading;
    document.getElementById('about-text').textContent = data.aboutText;
    document.getElementById('contact-heading').textContent = data.contactHeading;
    const contactEmail = document.getElementById('contact-email');
    contactEmail.innerHTML = `<a href="mailto:${data.email}">${data.email}</a>`;
    document.getElementById('copyright').textContent = `\u00A9 ${new Date().getFullYear()} ${data.author}`;
  });
