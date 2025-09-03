# Payment Roster Dashboard - Render Deployment Guide

This guide will help you deploy your Payment Roster Dashboard backend to Render.com with PostgreSQL database.

## 🚀 Quick Start

### 1. Create Render Account
- Go to [render.com](https://render.com) and sign up
- Connect your GitHub account

### 2. Deploy Database
1. Click "New" → "PostgreSQL"
2. Name: `payment-roster-db`
3. Plan: Free tier
4. Region: Choose closest to your users
5. Click "Create Database"
6. Copy the connection details (you'll need them later)

### 3. Deploy Backend
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure service:
   - **Name**: `payment-roster-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend` (if your backend is in a subfolder)

### 4. Set Environment Variables
In your backend service settings, add these environment variables:

```
NODE_ENV=production
DB_HOST=your-render-postgres-host
DB_USER=your-render-postgres-user
DB_PASSWORD=your-render-postgres-password
DB_DATABASE=your-render-postgres-database
DB_PORT=5432
JWT_SECRET=your-very-secure-jwt-secret-here
CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app
```

### 5. Setup Database Schema
1. Go to your PostgreSQL service → "Connect" → "External Connection"
2. Use any PostgreSQL client (like pgAdmin, DBeaver, or psql)
3. Run the SQL from `render-schema.sql`

### 6. Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your project from GitHub
3. Set build settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
   ```

## 📋 Default Login Credentials

After running the database schema, you can login with:
- **Admin**: admin@paymentroster.com / admin123
- **Employee**: john@example.com / admin123

## 🧪 Testing Your Deployment

### 1. Backend Health Check
```bash
curl https://your-backend-url.onrender.com/
# Should return: "Backend running..."
```

### 2. API Test
```bash
curl -X POST https://your-backend-url.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@paymentroster.com","password":"admin123"}'
```

### 3. Frontend Test
- Visit your Vercel frontend URL
- Try logging in with the credentials above
- Test adding/viewing payments

## 🔧 Troubleshooting

### Common Issues:

1. **"No start command found"**
   - Ensure your `package.json` has: `"start": "node server.js"`
   - Ensure `"main": "server.js"`

2. **Database connection failed**
   - Check your environment variables are correct
   - Ensure PostgreSQL service is running
   - Verify SSL settings in your code

3. **CORS errors**
   - Update `CORS_ORIGIN` to match your Vercel frontend URL
   - Include `https://` protocol

4. **Build fails**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is compatible (Render supports Node 14+)

### Logs and Debugging:
- Check Render service logs for detailed error messages
- Use Render's built-in shell to debug issues
- Test locally first before deploying

## 📊 Performance & Scaling

### Free Tier Limits:
- 750 hours/month
- 512 MB RAM
- 1 GB storage (PostgreSQL)

### Optimization Tips:
1. Use connection pooling for database connections
2. Implement caching for frequently accessed data
3. Monitor your usage in Render dashboard
4. Consider upgrading to paid plans for production use

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit secrets to code
2. **JWT Secret**: Use a long, random string
3. **Database**: Use Render's managed PostgreSQL (includes backups)
4. **HTTPS**: Render automatically provides SSL certificates
5. **CORS**: Restrict to your frontend domain only

## 📞 Support

- Render Documentation: https://docs.render.com/
- PostgreSQL Guide: https://docs.render.com/postgresql
- Vercel Integration: https://vercel.com/docs

Your Payment Roster Dashboard should be fully deployed and accessible once you complete these steps!
