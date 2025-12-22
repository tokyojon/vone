# Quick Start Guide

Get up and running with Oneness Kingdom in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from Settings → API
3. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Initialize Database

1. Open Supabase SQL Editor
2. Copy all content from `supabase-schema.sql`
3. Run the SQL to create tables and policies

## Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test the Flow

1. Click "登録" (Register) button
2. Fill in the signup form
3. Submit to create account
4. You'll be redirected to the dashboard
5. Check Supabase → Authentication → Users to verify

## Features Overview

### Landing Page (`/`)
- Hero section with platform description
- Features showcase
- Call-to-action buttons

### Auth Page (`/auth`)
- Combined signup/login in one page
- Toggle between modes
- Email + password authentication
- OAuth options (Google, Apple)
- Japanese/English text

### Dashboard (`/dashboard`)
- Protected route (requires login)
- User statistics (points, tasks, reviews)
- Activity feed
- Notifications
- Community highlights
- Quick actions

## Customization

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --background: #f5f5f0;  /* Beige background */
  --foreground: #171717;   /* Text color */
}
```

### Update Branding
- Logo: Replace the colored div in navigation with your logo
- Name: Search and replace "ワンネスキングダム" / "Oneness Kingdom"

### Add Features
1. Create new page in `app/` folder
2. Use Supabase client from `lib/supabase.ts`
3. Add RLS policies in Supabase for data access

## Deployment

### Deploy to Vercel

```bash
npm run build
```

Then:
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Or use the Vercel button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Update Supabase Redirects

After deploying, add your production URL to:
- Supabase → Authentication → URL Configuration
- OAuth provider redirect URLs

## Troubleshooting

**"Invalid API key" error**
- Restart dev server after changing `.env.local`
- Verify you copied the correct keys

**"Not authenticated" on dashboard**
- Check browser console for errors
- Verify Supabase connection
- Try signing out and back in

**OAuth not working**
- Configure OAuth providers in Supabase
- Add correct redirect URLs
- Check provider credentials

## Support

- [Full Documentation](./README.md)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)

Happy building! 🚀
