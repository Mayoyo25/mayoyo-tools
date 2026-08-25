# JSON Validator

A lightweight, client-side JSON validator and formatter for internal/team use.

## Privacy

JSON is processed entirely in the browser.

This project has:

- No backend
- No database
- No API
- No analytics
- No cookies
- No localStorage
- No sessionStorage
- No JSON persistence

The application only needs a network connection to load the pinned CDN assets. The JSON itself is not sent to those CDNs or to any application server.

## Features

- JSON validation
- Pretty formatting
- Minification
- Syntax error location
- JSON type detection
- Character and line counts
- Copy formatted JSON
- Download `.json`
- Sample JSON
- Keyboard shortcut: `Ctrl+Enter`
- Client-side processing only

## Dependencies

Pinned CDN versions:

- Tailwind CSS Browser 4.1.12
- PrismJS 1.30.0

The actual JSON parsing uses the browser's native `JSON.parse()` API.

## GitHub Pages

This is a static site. Push the repository to GitHub and enable:

`Settings -> Pages -> Deploy from a branch`

Select the branch containing `index.html`.

## Security note

The CDN scripts are used only for presentation/tooling. They do not receive the contents of the JSON editor.

For a stricter air-gapped deployment, download/vendor the two CDN assets locally and remove the external `<script>` and `<link>` references.
