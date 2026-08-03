# GearUp — Frontend

"Field Journal" themed frontend for GearUp, built against `GearUp_DESIGN.md`.

## 🚀 Deployment

**Live Frontend**: [Deploy on Vercel](https://vercel.com/new)  
**Backend API**: https://gear-up-eta.vercel.app  
**GitHub Repository**: https://github.com/Mohaimen-Hridoy/GearUp (Backend)

## 📋 Admin Credentials

**Email**: admin@gearup.com  
**Password**: Admin@12345

See `ADMIN_CREDENTIALS.md` for more test accounts.

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_API_URL=https://gear-up-eta.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Or copy the example file:
```bash
cp .env.example .env.local
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
npm start
```

## Features

### Current Status
- ✅ Complete "Field Journal" themed UI with canvas/paper design system
- ✅ All public pages: Home, Gear browse, Gear details
- ✅ Authentication pages: Login, Register with role-based access
- ✅ Customer dashboard: Overview, Order history, Payment flow
- ✅ Provider dashboard: Gear management, Order management
- ✅ Admin dashboard: User management, Platform overview
- ✅ Stripe Elements integration for payments
- ✅ Responsive design with mobile-optimized layouts
- ✅ Loading skeletons for all routes
- ✅ Real API integration with backend
- ✅ Error handling and validation throughout

### Design System
- **Canvas** (`#182620`): Deep forest for navbar, footer, hero sections
- **Paper** (`#f4efe2`): Cream surfaces for cards, forms, tables
- **Moss** (`#5c7a5e`): Primary accent for buttons, links
- **Brass** (`#c1873f`): Secondary accent for prices, highlights
- **Equipment Tag motif**: Punched hole + dashed border cards

## API Integration

The app is fully integrated with the backend API at `https://gear-up-eta.vercel.app`.

See `API_INTEGRATION.md` for the complete mapping of frontend components to backend endpoints.

### Key Integration Points
- **Gear**: `GET /api/gear`, `GET /api/gear/:id`, `POST /api/provider/gear`, `PUT /api/provider/gear/:id`
- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **Rentals**: `GET /api/rentals`, `POST /api/rentals`, `PATCH /api/provider/orders/:id`
- **Payments**: `POST /api/payments/create`, `POST /api/payments/confirm`
- **Admin**: `GET /api/admin/users`, `PATCH /api/admin/users/:id`, `GET /api/admin/gear`, `GET /api/admin/rentals`

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: `https://gear-up-eta.vercel.app`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
4. Deploy

The project includes `vercel.json` for deployment configuration.

### Environment Variables for Production
```
NEXT_PUBLIC_API_URL=https://gear-up-eta.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Project Structure

```
gearup/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   │   ├── customer/      # Customer dashboard
│   │   ├── provider/      # Provider dashboard
│   │   └── admin/         # Admin dashboard
│   ├── gear/              # Gear browsing and details
│   └── payment/           # Payment success/cancel pages
├── components/
│   ├── gear/              # Gear-specific components
│   ├── layout/            # Layout components (navbar, footer)
│   ├── payment/           # Payment components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api.ts             # API fetch wrapper
│   ├── api-service.ts     # Centralized API service layer
│   ├── auth-store.ts      # Authentication state management
│   ├── mock-data.ts       # Mock data for development
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand (auth), React Query (server state)
- **Forms**: React Hook Form + Zod validation
- **Payments**: Stripe Elements
- **Date Picker**: react-day-picker
- **Notifications**: Sonner (toast notifications)
- **Icons**: Lucide React

## Development Notes

### API Integration
The app is fully integrated with the production backend API. The `lib/api-service.ts` file contains all API calls organized by feature area.

### Design Tokens
All colors and spacing are defined as CSS variables in `app/globals.css`:
- `--canvas`, `--canvas-light`: Dark backgrounds
- `--paper`, `----paper-dim`: Light surfaces
- `--moss`, `--moss-dark`: Primary accents
- `--brass`, `--brass-dark`: Secondary accents
- `--rust`: Danger/error states
- `--sky`: Info states

### Component Patterns
- Use `GearCard` for gear items in grids
- Use `StatTile` for dashboard statistics
- Use `StatusBadge` for order/user status
- Use `DataTable` + `Pagination` for new table pages
- Use `ConfirmDialog` for destructive actions

## Assignment Requirements Met

✅ **API Integration & Documentation** - All backend endpoints integrated with documented mapping  
✅ **Consistent UI Error Handling** - Toast notifications, inline form errors, error boundaries  
✅ **20 Meaningful Commits** - Conventional commit standards with descriptive messages  
✅ **Form Validation** - Zod + React Hook Form on all forms with clear error messages  
✅ **Admin Credentials** - Working admin email/password provided in ADMIN_CREDENTIALS.md  
✅ **Payment Integration** - Stripe Elements with success/cancel redirect pages

## License

This project is part of the GearUp platform.
