# Basic Vue App

A reusable Vue 3 application template built with Vite and Tailwind CSS. Designed as a starting point for building modern, responsive web applications.

## Features

- **Vue 3** — Composition API and Single-File Components.
- **Vite** — Fast development server and optimized production builds.
- **Tailwind CSS** — Utility-first styling and customizable themes.
- **Vue Router** — Client-side navigation and route management.
- **Pinia** — Centralized state management.
- **ESLint** — Code quality and consistency checks.
- **Prettier** — Consistent code formatting.
- **Responsive Layout** — Reusable components and layouts for different screen sizes.
- **Theme Support** — Multiple color themes and dark mode support.

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tgsutterby/basic-vue-app.git
cd basic-vue-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Vite will display a local URL in your terminal where you can open the application in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Build the application for production. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint to check code quality. |

## Project Structure

```text
basic-vue-app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable Vue components
│   ├── css/            # Global styles and themes
│   ├── layouts/        # Application layouts
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores
│   ├── views/          # Application pages
│   ├── widgets/        # Reusable UI widgets
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── index.html
├── package.json
└── vite.config.js
```

## Customization

This template is intended to be adapted to your own projects.

- Update application metadata and the page title in `index.html`.
- Add or modify pages in `src/views/`.
- Build reusable interface elements in `src/components/`.
- Configure navigation in `src/router/`.
- Manage shared application state with Pinia stores in `src/stores/`.
- Customize colors, themes, and global styling in `src/css/`.

## Production Build

Create an optimized production build:

```bash
npm run build
```

The generated files will be placed in the `dist/` directory. Deploy this directory to your preferred static hosting provider.

## Contributing

Contributions, suggestions, and bug reports are welcome. Please open an issue to discuss significant changes before submitting a pull request.

## License

See the [LICENSE](LICENSE) file for the applicable license terms.

If no `LICENSE` file exists, all rights are reserved by default. Add an appropriate license before granting others permission to reuse, modify, or distribute this template.

---

Built with Vue 3 and Vite.