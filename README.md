# Oneness Kingdom - ワンネスキングダム

A meta-social platform built with Next.js and Supabase, featuring combined authentication (signup/login) and user dashboard.

## Features

- 🔐 Combined signup/login page with email and OAuth (Google, Apple)
- 🎨 Beautiful Japanese-inspired UI matching the design mockups
- 🔒 Protected routes with Supabase authentication
- 📱 Responsive dashboard with user stats and activity feed
- 🌐 Multi-language support (Japanese/English)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy the `.env.local` file and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Set Up Supabase Authentication

In your Supabase dashboard:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Enable **Google** and **Apple** OAuth providers:
   - Configure redirect URLs: `http://localhost:3000/dashboard`
   - Add your OAuth credentials

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Project Structure

```
vone/
├── app/
│   ├── auth/          # Combined signup/login page
│   ├── dashboard/     # Protected user dashboard
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Landing page
│   └── globals.css    # Global styles
├── lib/
│   └── supabase.ts    # Supabase client configuration
└── components/        # Reusable components (add as needed)
```

## Routes

- `/` - Landing page
- `/auth` - Combined signup/login page
- `/dashboard` - Protected user dashboard (requires authentication)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)

## Authentication Flow

1. User visits `/auth` page
2. Can toggle between login and signup modes
3. Options:
   - Email/password authentication
   - Google OAuth
   - Apple OAuth
4. Upon successful auth, redirects to `/dashboard`
5. Dashboard checks authentication status and protects content

## Customization

### Colors

The design uses these primary colors (defined in `globals.css`):
- Background: `#f5f5f0` (beige)
- Primary: `#d97706` (orange)
- Secondary: `#c89968` (gold)

### User Metadata

When signing up, the username is stored in Supabase user metadata:
```typescript
options: {
  data: {
    username: 'user-input',
  },
}
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

Deploy easily to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to add your environment variables in the Vercel dashboard.

## License

ISC

---

© 2024 Oneness Kingdom. All rights reserved.
# vone
