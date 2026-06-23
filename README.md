# НЕ-ДУЖЕ-СЕКРЕТНО

Personal Ukrainian site with a "secret file / military archive" theme — but not too serious.

## Live Site

This project is ready for **GitHub Pages**. After pushing it to GitHub:

1. Open the repository settings.
2. Go to **Pages**.
3. Set the source to **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder.

GitHub will publish `index.html` as the site homepage.

## Stack

- Pure **HTML + CSS + JavaScript** — no framework, no build step, no backend
- Google Fonts: *VT323* (display headings) + *Share Tech Mono* (body monospace)
- Designed for **GitHub Pages** static hosting from the repository root
- Also compatible with Netlify

## Running Locally

Open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Site Sections

| Section | Ukrainian | Description |
|---------|-----------|-------------|
| Hero | Головна | Full-screen opening with typewriter effect and file metadata |
| About | Про мене | Humorous ID card with redacted fields |
| Projects | Проєкти | Five interactive project cards (Відео, Історія, RP, Мапінг, Дивні експерименти) |
| Gallery | Галерея | SVG placeholder archive images in a masonry-style grid |
| Log | Журнал | Three styled log entries (LOG 01–03) |
| Contact | Контакт | Signal button with animated terminal feedback |

## Easter Egg

Click the main title **5 times** within 3 seconds to unlock the secret panel.

## Repository Files

```text
.
├── index.html      # Page markup
├── style.css       # Visual design
├── script.js       # Interactions and animations
├── netlify.toml    # Optional Netlify config
├── .nojekyll       # GitHub Pages static-site marker
├── .gitignore      # Local files ignored by Git
├── .gitattributes  # Text normalization for Git
├── README.md       # Project documentation
└── AGENTS.md       # Architecture notes
```
