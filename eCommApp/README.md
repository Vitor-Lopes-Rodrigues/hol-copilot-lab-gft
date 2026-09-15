Because this session is read-only, I did not modify `README.md`. The following section can be added after the introduction or used to replace the current setup section.

```md
## Quick Start Guide

### Prerequisites

- Node.js 18 or later
- npm
- A modern web browser

### Install and Run

From the repository root:

```bash
cd eCommApp
npm install
npm run dev
```

Vite starts the development server at:

```text
http://localhost:3000
```

The browser should open automatically. If port `3000` is unavailable, Vite may use another port and will display the URL in the terminal.

### Important Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check the project and create a production build |
| `npm run preview` | Preview the generated production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests and generate a coverage report |
| `npm run test:ui` | Open the Vitest UI |

A useful pre-commit check is:

```bash
npm run lint
npm run test:run
npm run build
```

### Production Build

Create the production files with:

```bash
npm run build
```

The output is written to:

```text
dist/
```

To preview that build locally:

```bash
npm run preview
```

The application is a client-side SPA, so production hosting must route unknown paths back to `index.html`.

## Application Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/products` | Product catalog |
| `/cart` | Shopping cart and simulated checkout |
| `/login` | Admin login |
| `/admin` | Admin sale controls |

For the demo login, use:

```text
Username: admin
Password: admin
```

This is demonstration-only authentication. It is hardcoded in the frontend and must not be used in a production application.

## Project Structure

```text
eCommApp/
├── public/
│   └── products/
│       ├── *.json              # Product data
│       └── productImages/      # Product images
├── src/
│   ├── components/             # Pages and reusable UI components
│   ├── context/
│   │   └── `CartContext.tsx`     # Shared cart state
│   ├── test/
│   │   ├── `setup.ts`            # Global test setup
│   │   └── `test-utils.tsx`      # Shared test render helpers
│   ├── types/
│   │   └── `index.ts`            # TypeScript interfaces
│   ├── utils/
│   │   └── `helpers.ts`          # Formatting and validation helpers
│   ├── `App.tsx`                 # Route definitions
│   ├── `main.tsx`                # Application entry point
│   ├── App.css                 # Application styles
│   └── index.css               # Global styles
├── index.html
├── `package.json`
├── `tsconfig.json`
├── tsconfig.node.json
├── `vite.config.ts`
└── `README.md`
```

## Product Data

Products are loaded from static JSON files in `public/products`.

When adding a product:

1. Add a JSON file to `public/products`.
2. Add its image to `public/products/productImages`.
3. Ensure the JSON `image` value matches the image filename.
4. Add the JSON filename to the product list in `src/components/ProductsPage.tsx`.

The current product catalog is explicitly listed in `ProductsPage.tsx`; adding a JSON file alone does not automatically display it.

## Testing

Tests use Vitest and Testing Library. Test files use the `.test.tsx` or `.test.ts` naming convention.

Run the existing tests with:

```bash
npm run test:run
```

Generate coverage with:

```bash
npm run test:coverage
```

Coverage reports are generated in the configured coverage output directory and include text, JSON, and HTML formats.

## Current Application Limitations

- The cart is stored in memory and is lost when the page is refreshed.
- Checkout is simulated; no payment or order service is connected.
- Reviews are stored only in component state.
- There is no backend or database.
- Admin authentication is not persistent or secure.
- The admin sale percentage is displayed but does not currently update product prices.
```

This would give new developers the operational information currently missing while documenting the application’s prototype limitations clearly.