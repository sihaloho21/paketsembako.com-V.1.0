# Paket Sembako Frontend

Frontend-only version of the Paket Sembako e-commerce application. All backend-related code, including mock APIs, has been removed to focus entirely on UI/UX development.

## Project Structure

```
artifacts/
└── hypermart-store/          # Main frontend application
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/           # Page components
    │   ├── hooks/           # Custom React hooks
    │   ├── lib/             # Utilities and API interfaces
    │   └── App.tsx          # Main app component
    ├── public/              # Static assets
    └── vite.config.ts       # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The application will start at `http://localhost:5173`

### Build

```bash
pnpm build
```

## Features

- **UI-Only**: Focused on frontend structure and layout.
- **Responsive Design**: Mobile-first UI with TailwindCSS.
- **Component Library**: Pre-built UI components using Radix UI.
- **Routing**: Wouter for client-side routing.

## Pages

- **Home** (`/`)
- **Products** (`/products`)
- **Categories** (`/categories`)
- **Product Detail** (`/product/:id`)
- **Account** (`/account`)
- **Points** (`/poin`)
- **Level** (`/level`)
- **Vouchers** (`/voucher`)
- **XP History** (`/xp-history`)

## License

MIT
