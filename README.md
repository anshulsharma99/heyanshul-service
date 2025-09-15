# Hey Anshul

This repository contains a simple data-driven personal website for a software developer engineer in test.

The site is designed to look clean and minimal, similar to Apple's style. Blog posts are loaded directly from the repository's `blogs` directory using a generated `blog-index.json` file, so new content can be added without modifying application code.

All posts are listed on a dedicated [blog.html](blog.html) page as well as the blog section of the homepage.

## Adding a Blog Post

1. Create a new folder inside the `blogs/` directory. The folder name will be used in the URL and listing.
2. Place a Markdown (`.md`) or plain text (`.txt`) file inside that folder. Only one file is needed per post.
3. Run `node generate-blog-index.js` to rebuild `blog-index.json`.
4. Commit and push your changes. The directory structure will automatically appear on the website.
