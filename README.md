# heyanshul-service

A fully rewritten personal website and blog explorer for [heyanshul.in](https://www.heyanshul.in).

## What's new in this rewrite

- Brand new homepage design with cleaner content hierarchy.
- Rebuilt blog experience with:
  - nested section navigation,
  - keyword search,
  - deep-linkable posts (hash-based URLs),
  - metadata-aware titles and summaries.
- Improved blog index generator that extracts headings and summaries directly from post content.

## Project structure

- `index.html` — marketing-style homepage.
- `blog.html` — interactive blog explorer UI.
- `script.js` — client-side post tree rendering and markdown loading.
- `generate-blog-index.js` — scans `blogs/` and generates `blog-index.json`.
- `blogs/` — markdown content organized by topic.

## Local development

```bash
node generate-blog-index.js
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Adding or updating posts

1. Add a `.md` or `.txt` file under `blogs/`.
2. Use a top-level Markdown heading (`#`) to set the post title.
3. Keep the first paragraph concise—it becomes the post summary.
4. Regenerate the index:

```bash
node generate-blog-index.js
```

## License

MIT.
