# Implementation Plan - Extended Features

## Overview
Integrating 6 new screens into the Oneness Kingdom platform with earthy, cohesive design throughout.

## New Features to Implement

### 1. Profile/Settings Page (`/settings`)
**Screens:** Profile editing screen
**Features:**
- Profile editing (username, name, bio, website)
- Notification settings (followers, comments, likes, email)
- Privacy settings (public/blocked account)
- Security settings (password change)
- Account deletion

**Database:**
- Updates `profiles` table with settings columns

### 2. Dashboard Customization (`/customize`)
**Screens:** Dashboard customization screen
**Features:**
- Available widgets sidebar
- Active widgets management
- Drag & drop reordering
- Widget settings/deletion
- Save/Reset to default

**Database:**
- `dashboard_widgets` JSONB column in profiles

### 3. Marketplace (`/marketplace`)
**Screens:** Marketplace browse screen
**Features:**
- Search by skill/keyword
- Category filters
- Service listings grid
- Post new listing button
- User avatars and categories

**Database:**
- `marketplace_listings` table
- `user_skills` table

### 4. Wallet (`/wallet`)
**Screens:** Wallet/points screen
**Features:**
- WNP (ワンネスポイント) balance display
- ONT tokens display
- Send points function
- Exchange to ONT
- Transaction history (All/Earned/Used tabs)
- Transaction details (gifts, likes, exchanges, bonuses)

**Database:**
- `wallet_transactions` table
- `wnp_points` & `ont_tokens` in profiles

### 5. User Profile View (`/profile/[username]`)
**Screens:** Public profile view
**Features:**
- User info (avatar, name, bio, role)
- Activity feed tabs (Contributions/Skills/Family/Community)
- Follow button
- Message button
- Recent activities timeline

**Database:**
- `activities` table
- `user_skills` table
- `communities` & `community_members` tables

### 6. Enhanced Dashboard
**Already implemented** with customization support

## Design System - Earthy "Oneness" Theme

### Colors
```
Primary: #ec6d13 (warm orange)
Background Light: #f8f7f6 (cream)
Background Dark: #221810 (dark brown)
Text Light Primary: #181411 (dark brown)
Text Light Secondary: #897261 (medium brown)
Surface Light: #ffffff (white)
Border Light: #f4f2f0 (light cream)
```

### Typography
```
Font: Plus Jakarta Sans, Noto Sans JP
Headings: Bold (700-900)
Body: Regular (400) / Medium (500)
```

### Components
- Rounded corners (xl: 1.5rem)
- Subtle shadows
- Clean, minimal design
- Consistent spacing
- Material icons for symbols

## Database Schema

Already created in `supabase-schema-complete.sql`:

### New Tables:
1. **wallet_transactions** - Point/token transactions
2. **marketplace_listings** - Services marketplace
3. **user_skills** - User skills/interests
4. **communities** - Community groups
5. **community_members** - Community membership
6. **activities** - User activity feed
7. **bookmarks** - Saved posts

### Updated Tables:
1. **profiles** - Added settings, points, dashboard_widgets

## Implementation Order

1. ✅ Update color scheme and fonts
2. ✅ Create enhanced database schema  
3. 🔄 Build Settings page
4. 🔄 Build Marketplace page
5. 🔄 Build Wallet page
6. 🔄 Build Profile view page
7. 🔄 Build Dashboard customization
8. 🔄 Update existing dashboard
9. 🔄 Create reusable components
10. 🔄 Test all features

## Next Steps

1. Run `supabase-schema-complete.sql` in Supabase SQL Editor
2. Implement each page one by one
3. Create shared components (Header, Cards, Buttons)
4. Add navigation between pages
5. Test wallet transactions
6. Test marketplace functionality
7. Test dashboard customization

## File Structure

```
app/
├── settings/page.tsx          # Profile & settings
├── marketplace/page.tsx       # Services marketplace
├── wallet/page.tsx           # Points & wallet
├── profile/[username]/page.tsx # Public profile
├── customize/page.tsx        # Dashboard customization
└── dashboard/page.tsx        # Enhanced dashboard

components/
├── Header.tsx               # Shared header
├── Sidebar.tsx             # Navigation sidebar
├── Card.tsx                # Reusable card
└── WidgetCard.tsx          # Dashboard widget
```

## Routes

- `/` - Landing page
- `/auth` - Combined signup/login
- `/dashboard` - Main dashboard
- `/settings` - Profile & settings
- `/marketplace` - Services marketplace
- `/wallet` - Points & wallet
- `/profile/[username]` - User profile
- `/customize` - Dashboard customization

