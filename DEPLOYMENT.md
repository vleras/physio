# Vercel Deployment Guide

## Project Type
**Next.js 16** with App Router

## Pre-Deployment Checklist

### ✅ Environment Variables
Create a `.env.local` file (or set in Vercel dashboard) with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### ✅ Build Configuration
- ✅ `package.json` has correct scripts: `build`, `dev`, `start`
- ✅ `next.config.js` is properly configured
- ✅ `vercel.json` includes caching headers and security headers
- ✅ TypeScript configuration is correct

### ✅ Code Quality
- ✅ Removed console.log statements (kept console.error for debugging)
- ✅ All imports use relative paths or `@/` alias
- ✅ No server-side code outside `/app` or `/pages` directories

### ✅ Assets
- ✅ Public assets are in `/public` directory
- ✅ Images are optimized with Next.js Image component
- ✅ Static files are properly referenced

## Deployment Steps on Vercel

### 1. Connect Your Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)

### 2. Configure Project Settings
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (root of your project)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 3. Add Environment Variables
In the Vercel project settings, add:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Get from Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | Get from Supabase dashboard |

**Important**: 
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to Git
- Add `.env.local` to `.gitignore`

### 4. Deploy
1. Click "Deploy"
2. Vercel will:
   - Install dependencies
   - Run the build command
   - Deploy to production
   - Provide you with a deployment URL

### 5. Post-Deployment
- ✅ Verify the site loads correctly
- ✅ Test API routes (`/api/teamlogos`)
- ✅ Check that images load from Supabase
- ✅ Test product pages and catalog
- ✅ Verify environment variables are working

## Project Structure

```
physio/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── catalog/           # Catalog page
│   ├── product/           # Product detail pages
│   ├── services/          # Services page
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utility functions
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── vercel.json            # Vercel-specific config
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## API Routes
- `/api/teamlogos` - Returns list of team logo images

## Important Notes

### Supabase Configuration
- Ensure your Supabase project has proper Row Level Security (RLS) policies
- Verify that the `Products` table exists and has the correct schema
- Check that image URLs from Supabase storage are accessible

### Image Optimization
- Next.js Image component is used throughout
- Images from Supabase are configured in `next.config.js`
- Local images are in `/public/images/`

### Performance
- Static assets are cached for 1 year (configured in `vercel.json`)
- Next.js automatically optimizes images
- React Strict Mode is enabled

## Troubleshooting

### Build Fails
1. Check environment variables are set correctly
2. Verify all dependencies are in `package.json`
3. Check for TypeScript errors: `npm run lint`
4. Ensure Node.js version is compatible (Vercel uses Node 18+ by default)

### Images Not Loading
1. Verify Supabase storage bucket is public
2. Check `next.config.js` remote patterns
3. Ensure image URLs are correct

### API Routes Not Working
1. Verify API route files are in `app/api/` directory
2. Check that routes export proper HTTP methods (GET, POST, etc.)
3. Verify environment variables are set

### Environment Variables Not Working
1. Ensure variables start with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding new environment variables
3. Check Vercel dashboard for variable values

## Support
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

