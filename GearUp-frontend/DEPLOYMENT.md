# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git repository set up
- Vercel account (for deployment)

## Environment Variables

Create these environment variables in your deployment platform:

### Required
- `NEXT_PUBLIC_API_URL` - Backend API URL (e.g., https://gear-up-eta.vercel.app)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Optional
- `NEXT_PUBLIC_STRIPE_SECRET_KEY` - Stripe secret key (server-side only, if needed)

## Deployment Steps

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Pre-deployment commit"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add the required variables
   - Redeploy if needed

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Backend API

The frontend is configured to use the production backend at:
```
https://gear-up-eta.vercel.app
```

If you need to use a different backend, update `NEXT_PUBLIC_API_URL`.

## Stripe Configuration

1. Get your Stripe keys from the Stripe Dashboard
2. Add publishable key to environment variables
3. Ensure Stripe webhooks are configured if using server-side confirmation

## Verification

After deployment:
1. Test login flow with admin credentials
2. Test gear browsing and rental creation
3. Test payment flow (in test mode)
4. Test all dashboards (customer, provider, admin)

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)

### API Errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend API is accessible
- Check CORS configuration on backend

### Payment Errors
- Verify Stripe keys are correct
- Check Stripe account is in test mode for development
- Ensure webhook endpoints are configured

## Performance Optimization

The app includes:
- Image optimization with Next.js Image component
- Static generation where possible
- Code splitting with dynamic imports
- Caching with React Query

## Security Notes

- Never commit `.env.local` files
- Use environment variables for sensitive data
- Enable HTTPS in production
- Keep dependencies updated
- Review security advisories regularly