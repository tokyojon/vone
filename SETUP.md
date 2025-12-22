# 🚀 SETUP INSTRUCTIONS

Follow these steps to get your Oneness Kingdom app running!

## Step 1: Create Environment File

Run this command in your terminal:

```bash
./create-env.sh
```

Or manually create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=https://mvivdndbuyfzsbtszqir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_v7RZRATLU8KtKpXpyjUung_ATIOpvtn
```

## Step 2: Set Up Supabase Database

1. Go to your Supabase project: https://mvivdndbuyfzsbtszqir.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy ALL content from `supabase-schema.sql` file
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for success message

You should see these tables created:
- profiles
- activities
- posts
- notifications
- follows

## Step 3: Enable Authentication Providers

### Email Authentication (Already enabled by default)
✅ No action needed

### Google OAuth (Optional)
1. In Supabase, go to **Authentication** → **Providers**
2. Click on **Google**
3. Enable the provider
4. Add your Google OAuth credentials (if you have them)
5. Add redirect URL: `http://localhost:3000/dashboard`

### Apple OAuth (Optional)
1. In Supabase, go to **Authentication** → **Providers**
2. Click on **Apple**
3. Enable the provider
4. Add your Apple credentials (if you have them)
5. Add redirect URL: `http://localhost:3000/dashboard`

## Step 4: Configure Redirect URLs

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Under "Redirect URLs", add:
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/`

## Step 5: Start the Application

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

## 🎉 Test the Application

1. **Visit Landing Page**: http://localhost:3000
   - Should see the beautiful landing page
   - Click "登録" or "今すぐ始める" buttons

2. **Try Signup**: http://localhost:3000/auth
   - Toggle to signup mode (should show username field)
   - Enter:
     - Username: test_user
     - Email: test@example.com
     - Password: password123
   - Click "メールアドレスで登録"

3. **Check Supabase**:
   - Go to **Authentication** → **Users**
   - You should see your new user!
   - Go to **Database** → **Table Editor** → **profiles**
   - You should see the user profile created automatically

4. **Access Dashboard**: http://localhost:3000/dashboard
   - After signup/login, you'll be redirected here
   - Should see your username and stats
   - Try the logout button

## 📊 Verify Database Setup

Run this query in Supabase SQL Editor to check if everything is set up:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- activities
- follows
- notifications
- posts
- profiles

## 🔧 Troubleshooting

### "Failed to fetch" error
- ✅ Check if .env.local file exists
- ✅ Verify Supabase URL and key are correct
- ✅ Restart the dev server: `npm run dev`

### "Profile creation failed"
- ✅ Run the SQL schema in Supabase
- ✅ Check if `handle_new_user` trigger exists
- ✅ Check Supabase logs: **Logs** → **Postgres Logs**

### Can't access dashboard
- ✅ Make sure you're signed in
- ✅ Check browser console for errors
- ✅ Try signing out and back in

### OAuth not working
- ✅ Enable the provider in Supabase
- ✅ Add correct redirect URLs
- ✅ Google/Apple credentials are optional for local testing

## 🌟 What's Next?

Once everything is working:

1. **Customize the Design**
   - Edit colors in `app/globals.css`
   - Update text in `app/page.tsx` (landing page)
   - Modify `app/auth/page.tsx` (auth page)

2. **Add Features**
   - Create posts functionality
   - Add notifications system
   - Build profile pages
   - Implement follow/unfollow

3. **Deploy to Production**
   - Push to GitHub
   - Deploy on Vercel
   - Update Supabase redirect URLs for production domain

## 📚 Documentation

- **README.md** - Complete documentation
- **QUICKSTART.md** - Quick setup guide
- **SUPABASE_SETUP.md** - Detailed Supabase guide

## ✅ Success Checklist

- [ ] .env.local file created
- [ ] Database schema executed in Supabase
- [ ] All tables visible in Supabase
- [ ] npm run dev running without errors
- [ ] Landing page loads at localhost:3000
- [ ] Can access /auth page
- [ ] Can create new account
- [ ] User appears in Supabase Auth
- [ ] Profile created in profiles table
- [ ] Dashboard loads after login
- [ ] Can logout successfully

---

Need help? Check the docs or review the error messages in:
- Browser console (F12)
- Terminal where npm run dev is running
- Supabase dashboard → Logs
