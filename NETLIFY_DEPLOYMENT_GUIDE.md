# Netlify Deployment Guide for Payment Roster Dashboard

## Prerequisites
- Netlify account (free tier available)
- GitHub repository with your project

## Step 1: Connect Repository to Netlify
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:

## Step 2: Build Settings
```
Base directory: (leave empty)
Build command: cd frontend && npm run build
Publish directory: frontend/dist
```

## Step 3: Environment Variables
Add these environment variables in Netlify dashboard:

```
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

Replace `your-render-backend-url` with your actual Render backend URL.

## Step 4: Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Your frontend will be live at `https://your-site-name.netlify.app`

## Step 5: Update Backend CORS (if needed)
Make sure your Render backend allows requests from your Netlify domain:

In your backend's CORS configuration, add your Netlify domain:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-site-name.netlify.app'
  ],
  credentials: true
};
```

## Testing the Deployment
1. Visit your Netlify URL
2. Try logging in with admin credentials
3. Test all dashboard features
4. Check browser console for any errors

## Troubleshooting
- If you see CORS errors, update backend CORS settings
- If API calls fail, verify the `VITE_API_BASE_URL` environment variable
- Check Netlify build logs for any build errors

## Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS records as instructed

## Continuous Deployment
Any push to your main branch will automatically trigger a new deployment on Netlify.
