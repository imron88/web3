# 🚀 Deploy Frontend to Vercel

## Quick Deploy (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
cd /home/linux/Desktop/web3-hackathon
vercel
```

Follow the prompts:
- Project name: `web3-hackathon`
- Setup: Yes
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

### Step 3: Configure Environment Variables

In Vercel dashboard, add:
```
VITE_SUPABASE_URL=https://phrmchigtabmmozhsjuz.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Step 4: Deploy to Production
```bash
vercel --prod
```

## Alternative: Deploy via GitHub

1. Push code to GitHub
2. Visit https://vercel.com
3. Click "Import Project"
4. Select your GitHub repo
5. Vercel auto-detects Vite
6. Add environment variables
7. Click "Deploy"

## Alternative: Netlify

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Your Live App Will Be:
```
https://your-project.vercel.app
```

Users can access it from anywhere with Petra wallet installed!
