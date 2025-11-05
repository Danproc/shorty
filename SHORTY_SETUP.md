# Shorty - URL Shortener Setup Guide

## Overview
Shorty is now a fully functional URL shortener and QR code generator! This guide will help you set up and deploy the application.

## Features Implemented

✅ **URL Shortening**
- Generate short, unique codes for any URL
- Support for custom slugs (authenticated users)
- Anonymous and authenticated usage

✅ **QR Code Generation**
- Automatic QR code generation for every short URL
- Download as PNG or SVG
- Responsive sizing

✅ **Click Tracking**
- Track clicks on each short URL
- View click counts in dashboard
- Last clicked timestamp

✅ **User Dashboard**
- View all your shortened URLs
- Create custom slugs
- Delete URLs
- Copy short links easily

## Setup Instructions

### 1. Database Migration

Run the SQL migration in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_create_short_urls.sql`
4. Paste and execute the SQL

This will:
- Create the `short_urls` table
- Set up indexes for performance
- Configure Row Level Security (RLS) policies
- Create the `increment_click_count` function

### 2. Environment Variables

Ensure you have these variables in your `.env.local`:

```bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site URL (for generating short URLs)
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change in production
```

### 3. Install Dependencies

Dependencies are already in `package.json`:
- `nanoid` v5.1.6 - Short code generation
- `qrcode.react` v4.2.0 - QR code generation

Run:
```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Visit:
- Homepage: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard (requires auth)

## How It Works

### URL Shortening Flow

1. **User enters a URL** on the homepage or dashboard
2. **API generates** a unique 7-character short code using nanoid
3. **URL is saved** to `short_urls` table in Supabase
4. **Short URL returned** in format: `yoursite.com/r/{shortCode}`
5. **QR code generated** client-side using qrcode.react

### Redirect Flow

1. **User visits** `/r/{shortCode}`
2. **Server queries** Supabase for the original URL
3. **Click count incremented** (fire-and-forget)
4. **User redirected** to original URL
5. If URL expired/deactivated, shows error page

### Dashboard Features

- **Authenticated users** can:
  - Create custom slugs (e.g., `/r/my-link`)
  - View all their URLs in a table
  - See click statistics
  - Delete URLs they own
  - Add titles to URLs for organization

- **Anonymous users** can:
  - Create short URLs on homepage
  - Get auto-generated short codes
  - Download QR codes
  - Cannot view history or manage URLs

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/urls/create` | POST | Optional | Create short URL |
| `/api/urls/list` | GET | Required | List user's URLs |
| `/api/urls/[id]` | GET | Optional | Get URL details |
| `/api/urls/[id]` | DELETE | Required | Delete URL |
| `/r/[shortCode]` | GET | None | Redirect to original URL |

## File Structure

```
shorty/
├── app/
│   ├── api/urls/
│   │   ├── create/route.js       # Create short URL
│   │   ├── list/route.js         # List user URLs
│   │   └── [id]/route.js         # Get/Delete URL
│   ├── r/[shortCode]/page.js     # Redirect handler
│   ├── dashboard/page.js         # User dashboard
│   └── page.js                   # Homepage
├── components/
│   ├── URLShortenerForm.js       # URL input form
│   ├── QRCodeDisplay.js          # QR code component
│   └── URLsList.js               # Dashboard URL list
├── libs/
│   ├── shortener.js              # URL utilities
│   └── qrcode.js                 # QR code utilities
└── supabase/migrations/
    └── 001_create_short_urls.sql # Database schema
```

## Database Schema

```sql
short_urls (
  id              UUID PRIMARY KEY
  user_id         UUID (nullable - for anonymous)
  short_code      VARCHAR(10) UNIQUE
  original_url    TEXT
  title           VARCHAR(255) (optional)
  created_at      TIMESTAMPTZ
  expires_at      TIMESTAMPTZ (nullable)
  click_count     INTEGER DEFAULT 0
  last_clicked_at TIMESTAMPTZ (nullable)
  is_active       BOOLEAN DEFAULT true
)
```

## Customization

### Change Short Code Length
In `libs/shortener.js`:
```javascript
export function generateShortCode(length = 7) {
  return nanoid(length); // Change 7 to desired length
}
```

### Add Reserved Slugs
In `libs/shortener.js`:
```javascript
export function isReservedSlug(slug) {
  const reserved = [
    'api', 'dashboard', 'signin',
    // Add your reserved slugs here
  ];
  return reserved.includes(slug.toLowerCase());
}
```

### Customize QR Code
In `libs/qrcode.js`:
```javascript
export const QR_CODE_DEFAULTS = {
  size: 256,
  level: 'M', // L, M, Q, H
  bgColor: '#ffffff',
  fgColor: '#000000', // Change for brand colors
  includeMargin: true,
};
```

## Deployment

### Vercel Deployment

1. **Push to GitHub**
2. **Import to Vercel**
3. **Add environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production URL)
4. **Deploy**

### Important: Set NEXT_PUBLIC_SITE_URL

In production, set this to your actual domain:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

This ensures short URLs use the correct domain.

## Security

- ✅ Row Level Security (RLS) enabled
- ✅ Users can only delete their own URLs
- ✅ Anonymous URLs have no user_id (anyone can read)
- ✅ URL validation prevents invalid URLs
- ✅ Reserved slugs protected
- ✅ Custom slug validation (alphanumeric + hyphens/underscores)

## Future Enhancements

- [ ] URL expiration dates
- [ ] Link passwords/protection
- [ ] Advanced analytics (referrers, locations, devices)
- [ ] Bulk URL creation
- [ ] API keys for programmatic access
- [ ] Link preview/metadata scraping
- [ ] Custom domains
- [ ] A/B testing with multiple destinations

## Troubleshooting

### Short URLs not redirecting
- Check database migration ran successfully
- Verify `increment_click_count` function exists
- Check Supabase RLS policies are active

### QR codes not downloading
- Check browser console for errors
- Ensure canvas/SVG element IDs match in code
- Try different browser

### "URL not found" errors
- Verify short_code exists in database
- Check is_active = true
- Ensure expires_at is null or future date

## Support

For issues, check:
1. Browser console for errors
2. Supabase logs for API errors
3. Next.js build output for compilation errors

## License

Built with ShipFast boilerplate and extended for URL shortening functionality.
