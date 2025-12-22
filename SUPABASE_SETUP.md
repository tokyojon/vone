# Supabase Setup Guide

Follow these steps to set up your Supabase backend for the Oneness Kingdom application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `oneness-kingdom`
   - Database password: (choose a strong password)
   - Region: (choose closest to your users)
5. Click "Create new project"
6. Wait for the project to be provisioned (1-2 minutes)

## 2. Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (a long JWT token)
3. Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press Cmd/Ctrl + Enter
6. Verify all tables are created in **Database** → **Tables**

## 4. Configure Authentication

### Email Authentication (Required)

1. Go to **Authentication** → **Providers**
2. **Email** should already be enabled
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails

### Google OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Create OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase
5. Save configuration

### Apple OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Enable **Apple**
3. Create Apple Sign In:
   - Go to [Apple Developer](https://developer.apple.com)
   - Create Services ID
   - Configure Sign in with Apple
   - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`
4. Copy credentials to Supabase
5. Save configuration

## 5. Configure URL Redirects

1. Go to **Authentication** → **URL Configuration**
2. Add redirect URLs:
   - Development: `http://localhost:3000/dashboard`
   - Production: `https://yourdomain.com/dashboard`

## 6. Test Authentication

1. Start your Next.js app: `npm run dev`
2. Go to `http://localhost:3000/auth`
3. Try signing up with email
4. Check Supabase dashboard → **Authentication** → **Users**
5. Verify your user appears in the list

## 7. Database Tables Created

The schema creates these tables:

- **profiles** - Extended user profile data
- **activities** - User activity log
- **posts** - User posts/content
- **notifications** - User notifications
- **follows** - User follow relationships

## 8. Row Level Security (RLS)

All tables have RLS enabled with policies:
- Users can only modify their own data
- Public data is viewable by everyone
- Sensitive data requires authentication

## Troubleshooting

### "Invalid API key"
- Check your `.env.local` file
- Verify you're using the `anon` key, not the `service_role` key
- Restart your dev server after changing `.env.local`

### "Failed to create profile"
- Check if the trigger `on_auth_user_created` exists
- Re-run the schema SQL if needed
- Check Supabase logs in **Logs** → **Postgres Logs**

### OAuth not working
- Verify redirect URLs match exactly
- Check OAuth provider credentials
- Ensure providers are enabled in Supabase dashboard

## Next Steps

Once setup is complete:
1. Test signup/login flow
2. Customize email templates
3. Add custom domain (production)
4. Set up storage buckets for user uploads (optional)
5. Configure realtime subscriptions (optional)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
