# API Integration — Completed

This document maps frontend components to backend endpoints for the GearUp application.

## Backend API
**Base URL**: `https://gear-up-eta.vercel.app`
**Documentation**: `https://documenter.getpostman.com/view/55052230/2sBY4Mw2SS`

## Component to Endpoint Mapping

### Authentication
- `app/auth/login/page.tsx` → `POST /api/auth/login`
- `app/auth/register/page.tsx` → `POST /api/auth/register`
- `lib/auth-store.ts` → Stores JWT token and user session

### Gear Management
- `app/page.tsx` → `GET /api/gear` (featured gear)
- `app/gear/page.tsx` → `GET /api/gear` (with filters)
- `app/gear/[id]/page.tsx` → `GET /api/gear/:id`
- `components/gear/gear-form.tsx` → `POST /api/provider/gear` (create), `PUT /api/provider/gear/:id` (edit)
- `app/dashboard/provider/gear/page.tsx` → `GET /api/provider/gear`, `DELETE /api/provider/gear/:id`, `PUT /api/provider/gear/:id`
- `components/gear/rental-date-picker.tsx` → `POST /api/rentals` (create rental)

### Rentals & Orders
- `app/dashboard/customer/page.tsx` → `GET /api/rentals` (customer rentals)
- `app/dashboard/customer/orders/page.tsx` → `GET /api/rentals` (customer orders)
- `app/dashboard/provider/orders/page.tsx` → `GET /api/provider/orders`, `PATCH /api/provider/orders/:id`
- `components/gear/rental-date-picker.tsx` → `POST /api/rentals`

### Payments
- `app/dashboard/customer/orders/[id]/pay/page.tsx` → `POST /api/payments/create`
- `app/payment/success/page.tsx` → `POST /api/payments/confirm`
- `components/payment/checkout-form.tsx` → Stripe Elements integration

### Reviews
- `app/dashboard/customer/orders/page.tsx` → `POST /api/reviews`

### Admin
- `app/dashboard/admin/page.tsx` → `GET /api/admin/users`, `GET /api/admin/gear`, `GET /api/admin/rentals`
- `app/dashboard/admin/users/page.tsx` → `GET /api/admin/users`, `PATCH /api/admin/users/:id`
- `app/dashboard/admin/gear/page.tsx` → `GET /api/admin/gear`
- `app/dashboard/admin/rentals/page.tsx` → `GET /api/admin/rentals`

## API Service Layer
All API calls are centralized in `lib/api-service.ts`:
- `authApi` - Authentication operations
- `gearApi` - Gear CRUD operations
- `rentalApi` - Rental and order management
- `paymentApi` - Payment processing
- `reviewApi` - Review submission
- `adminApi` - Admin operations

## Error Handling
- Centralized error handling in `lib/api.ts`
- User-friendly toast notifications via `showApiError()`
- Form validation errors displayed inline via React Hook Form
- Loading states and error boundaries throughout the app

## Admin Credentials
**Email**: `admin@gearup.com`
**Password**: `Admin@12345`

## Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key for payments
