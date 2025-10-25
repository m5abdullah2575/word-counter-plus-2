# Vercel Deployment Setup Instructions

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### Database (Required for Contact Form)
- `DATABASE_URL` - Your Neon/PostgreSQL connection string
  - Format: `postgresql://user:password@host/database?sslmode=require`

### Optional Email Notifications
- `RESEND_API_KEY` - Resend API key for email notifications
- `CONTACT_EMAIL` - Email address to receive contact form notifications

## Database Setup

1. Create a Neon database (or any PostgreSQL database)
2. Copy the connection string
3. Add it to Vercel environment variables as `DATABASE_URL`
4. Run the database migration:
   ```bash
   npm run db:push
   ```

## Vercel Environment Variables Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add `DATABASE_URL` with your PostgreSQL connection string
4. Optionally add `RESEND_API_KEY` and `CONTACT_EMAIL`
5. Redeploy your application

## Testing the Contact Form

After setting up the environment variables:
1. Redeploy on Vercel
2. Visit `/contact` page
3. Fill out and submit the form
4. Check your database for the new entry
