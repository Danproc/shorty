# 🚀 Shorty Quick Start Guide

Get your URL shortener running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great!)

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd shorty
npm install
```

## Step 2: Set Up Supabase Database

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the details and create your project
5. Wait for the project to finish setting up (~2 minutes)

### 2.2 Run the Database Migration

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Open the file `supabase/migrations/001_create_short_urls.sql` from this project
3. Copy all the SQL code
4. Paste it into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

You should see "Success. No rows returned" - that's perfect!

This creates:
- ✅ `short_urls` table for storing your links
- ✅ Indexes for fast lookups
- ✅ Row Level Security policies
- ✅ Click tracking function

## Step 3: Configure Environment Variables

### 3.1 Get Your Supabase Keys

In your Supabase project dashboard:

1. Click on **Project Settings** (gear icon in the left sidebar)
2. Click on **API** in the left menu
3. You'll see your keys:
   - **URL**: Copy the "Project URL"
   - **anon/public key**: Copy the "anon" key
   - **service_role key**: Copy the "service_role" key (click "Reveal" first)

### 3.2 Create .env.local File

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:

```bash
# Replace these with your actual Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Keep this as-is for local development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

## Step 4: Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## Step 5: Test It Out

### Test URL Shortening

1. Go to homepage or click "URL Shortener" in the navigation
2. Enter a URL (e.g., `https://google.com`)
3. Click "Shorten URL"
4. You should see:
   - ✅ Your shortened URL
   - ✅ A QR code
   - ✅ Copy button

### Test QR Code Generator

1. Click "QR Generator" in the navigation
2. Enter any URL
3. Click "Generate QR Code"
4. Download as PNG or SVG

### Test User Dashboard (Optional)

1. Click "Get Started" or "Sign In"
2. Create an account (or sign in with Google if configured)
3. Go to Dashboard
4. Create URLs with custom slugs
5. View your URL history and stats

## Troubleshooting

### "Failed to create short URL" Error

**Cause**: Database connection issue

**Fix**:
1. Double-check your `.env.local` has the correct Supabase keys
2. Make sure the database migration was run successfully
3. Restart your dev server (`Ctrl+C`, then `npm run dev`)

### "Invalid URL format" Error

**Cause**: URL needs a protocol

**Fix**: Make sure your URL starts with `http://` or `https://`
- ✅ `https://example.com`
- ✅ `http://example.com`
- ❌ `example.com` (will be auto-fixed to https://)

### QR Code Not Showing

**Cause**: Short URL was created but QR code didn't render

**Fix**:
1. Check browser console for errors (F12)
2. Make sure `qrcode.react` is installed: `npm install`
3. Refresh the page

### Short Links Not Redirecting

**Cause**: The redirect route isn't working

**Fix**:
1. Verify the migration created the `short_urls` table
2. Check that the short URL exists in Supabase (go to Table Editor)
3. Make sure `is_active` is `true` in the database

### Environment Variables Not Loading

**Cause**: Next.js didn't pick up the changes

**Fix**:
1. Make sure the file is named `.env.local` (not `.env`)
2. Restart the dev server completely
3. Make sure variables start with `NEXT_PUBLIC_` for client-side use

## What's Next?

### Deploy to Production

See [SHORTY_SETUP.md](./SHORTY_SETUP.md) for detailed deployment instructions.

Quick Vercel deployment:
```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# Go to vercel.com, import your repo

# 3. Add environment variables in Vercel dashboard
# (same as .env.local but with your production domain)

# 4. Deploy!
```

### Enable Additional Features

- **Stripe Payments**: Add Stripe keys to `.env.local` and configure pricing
- **Email Notifications**: Add Resend API key for transactional emails
- **Google OAuth**: Configure Google OAuth in Supabase Auth settings

## Need Help?

- 📖 Full documentation: [SHORTY_SETUP.md](./SHORTY_SETUP.md)
- 🐛 Issues: Check Supabase logs and browser console
- 💬 Questions: Open an issue on GitHub

---

**That's it! You should now have a fully functional URL shortener.** 🎊
