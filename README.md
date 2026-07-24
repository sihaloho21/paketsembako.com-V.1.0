# Paket Sembako Frontend

Frontend-only development version of the Paket Sembako e-commerce application. This version focuses on UI/UX development with mock data.

## Project Structure

```
artifacts/
└── hypermart-store/          # Main frontend application
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/           # Page components
    │   ├── hooks/           # Custom React hooks
    │   ├── lib/             # Utilities and mock API
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

- **Mock API**: All API calls return mock data for frontend development
- **Responsive Design**: Mobile-first UI with TailwindCSS
- **Component Library**: Pre-built UI components using Radix UI
- **State Management**: React Query for data fetching
- **Routing**: Wouter for client-side routing

## Mock Data

The application uses mock data for:
- Products listing and details
- Categories
- User profiles
- Vouchers and rewards
- Points history

Mock data is defined in `src/lib/gas-api.ts`

## Pages

- **Home** (`/`) - Landing page with featured products
- **Products** (`/products`) - Product listing with filters
- **Categories** (`/categories`) - Category browsing
- **Product Detail** (`/product/:id`) - Individual product details
- **Account** (`/account`) - User profile
- **Points** (`/poin`) - User loyalty points
- **Level** (`/level`) - User level/tier information
- **Vouchers** (`/voucher`) - Available vouchers
- **XP History** (`/xp-history`) - User experience history

## Development Notes

### Adding Backend Integration

When you're ready to integrate with a real backend:

1. Update `src/lib/gas-api.ts` to call your actual API endpoints
2. Update `src/lib/config.ts` to load real configuration
3. Configure your API base URL in `public/config.json`

### Styling

- Uses TailwindCSS for styling
- Component library: Radix UI
- Icons: Lucide React

### State Management

- React Query for server state
- React hooks for local state

## Deployment

### Netlify

The project is configured for Netlify deployment:

```bash
pnpm build
```

Build output is in `artifacts/hypermart-store/dist`

## License

MIT
