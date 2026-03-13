# Mano — Frontend

The frontend application for the Mano project, built with modern web technologies.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19 | UI library |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Type safety |
| [Vite](https://vite.dev) | 8 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first CSS framework |
| [Motion](https://motion.dev) | 12 | Animation library |
| [ESLint](https://eslint.org) | 9 | Code linting |
| [pnpm](https://pnpm.io) | 10+ | Package manager |

## Prerequisites

- **Node.js** >= 22
- **pnpm** >= 10

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the dev server (default: http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Preview the production build
pnpm preview

# Lint the codebase
pnpm lint
```

## Project Structure

```
frontend/
├── public/             # Static assets served as-is
├── src/
│   ├── assets/         # Images, fonts, and other assets
│   ├── App.tsx         # Root application component
│   ├── App.css         # App-specific styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles & Tailwind imports
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── eslint.config.js    # ESLint configuration
└── package.json
```

## Configuration

### Tailwind CSS

Tailwind v4 is integrated via the `@tailwindcss/vite` plugin. Styles are imported in `src/index.css`:

```css
@import "tailwindcss";
```

### Motion+

If you have a Motion+ license, create a `.npmrc` file in this directory:

```
@motionone:registry=https://npm.motionone.org
//npm.motionone.org/:_authToken=YOUR_TOKEN_HERE
```

> **Important:** The `.npmrc` file is gitignored to prevent leaking tokens.
