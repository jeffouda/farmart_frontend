# Frontend Deployment - Vercel

## Quick Deploy

1. Push to GitHub:
```bash
cd /home/jeff/Farmart/Farmart_frontend
git add vercel.json
git commit -m "chore: Update vercel config for production"
git push origin jeff/dev
```

2. Go to https://vercel.com/new
3. Import `farmart_frontend` repository
4. Select branch: `jeff/dev`
5. Add environment variable:
   - `VITE_API_URL` = `https://farmart-backend.onrender.com`
6. Click Deploy

## After Backend is Deployed

Update `VITE_API_URL` in Vercel dashboard with your actual Render backend URL.
