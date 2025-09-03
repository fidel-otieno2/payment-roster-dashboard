# Payment Roster Dashboard - Railway Deployment Guide

This guide will help you deploy the backend and database to Railway and integrate with your Vercel frontend.

## Prerequisites

1. Railway account (https://railway.app)
2. Vercel account (https://vercel.com)
3. GitHub repository with your project

## Step 1: Deploy PostgreSQL Database on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Choose "Database" → "PostgreSQL"
4. Name your database (e.g., "payment-roster-db")
5. Wait for the database to be provisioned
6. Go to the "Variables" tab in your database service
7. Copy the following environment variables (you'll need them later):
   - `DATABASE_URL` (this is the full connection string)

## Step 2: Deploy Backend on Railway

### Option A: Deploy from GitHub (Recommended)

1. In your Railway project, click "Add Service" → "GitHub Repo"
2. Connect your GitHub account and select your payment-roster repository
3. Railway will automatically detect the Dockerfile in your backend folder
4. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: Leave default (Docker)
   - **Start Command**: Leave default

### Option B: Manual Deployment

1. In your Railway project, click "Add Service" → "Empty Service"
2. Choose "Docker" as the deployment method
3. Upload your backend folder or provide the GitHub repo URL
4. Railway will use the existing Dockerfile

## Step 3: Configure Environment Variables

In your Railway backend service, go to "Variables" and add these environment variables:

### Database Configuration
```
DB_HOST=<your-postgres-host>
DB_USER=<your-postgres-user>
DB_PASSWORD=<your-postgres-password>
DB_DATABASE=<your-postgres-database-name>
DB_PORT=5432
```

### JWT Configuration
```
JWT_SECRET=<your-secure-jwt-secret>
```

### Email Configuration (Optional - for password reset)
```
SENDGRID_API_KEY=<your-sendgrid-api-key>
EMAIL_FROM=<your-email@example.com>
```

### Supabase Configuration (if using Supabase instead of Railway PostgreSQL)
```
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

## Step 4: Database Schema Setup

After your database is deployed, you need to create the tables. You can do this in several ways:

### Option A: Railway Database Console

1. In your Railway project, go to your PostgreSQL service
2. Click "Connect" → "PostgreSQL CLI" or "Database Console"
3. Run the following SQL commands:

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_payments_employee_id ON payments(employee_id);
CREATE INDEX idx_payments_date ON payments(date);
CREATE INDEX idx_users_email ON users(email);
```

### Option B: Using Railway CLI

If you have Railway CLI installed:

```bash
railway connect
# This will give you a PostgreSQL connection string
# Then use psql or any PostgreSQL client to run the schema
```

## Step 5: Update Vercel Frontend Configuration

1. Go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Update or add the environment variable:
   ```
   VITE_API_BASE_URL=<your-railway-backend-url>
   ```
   Replace `<your-railway-backend-url>` with your Railway backend service URL (e.g., `https://payment-roster-backend.up.railway.app`)

4. Redeploy your frontend to apply the new environment variable

## Step 6: Test the Deployment

### Test Backend Health
Visit your Railway backend URL:
```
https://your-backend-url.up.railway.app/
```
You should see: "Backend running..."

### Test API Endpoints
You can test the API endpoints using curl or Postman:

```bash
# Test backend health
curl https://your-backend-url.up.railway.app/

# Test SMTP (if configured)
curl https://your-backend-url.up.railway.app/api/test-smtp
```

### Test Frontend Integration
1. Visit your Vercel frontend URL
2. Try to login/register
3. Check browser console for any CORS or API errors
4. Verify that API calls are going to the Railway backend URL

## Step 7: Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Railway backend allows requests from your Vercel domain
2. **Database Connection**: Verify all database environment variables are correct
3. **JWT Secret**: Ensure JWT_SECRET is set and matches between deployments
4. **SSL Connection**: Railway PostgreSQL requires SSL, which is already configured in server.js

### Logs and Debugging

- Check Railway service logs in the dashboard
- Use Railway's built-in database console to verify data
- Test API endpoints individually using curl or Postman

### Environment Variables Verification

Make sure these are set in Railway:
- DB_HOST (without protocol, just hostname)
- DB_USER
- DB_PASSWORD
- DB_DATABASE
- DB_PORT (usually 5432)
- JWT_SECRET (secure random string)

## Step 8: Production Considerations

1. **Security**: Use strong JWT secrets and database passwords
2. **Backup**: Railway provides automatic backups for PostgreSQL
3. **Scaling**: Railway automatically scales your services
4. **Monitoring**: Use Railway's built-in monitoring tools
5. **Domain**: Consider using a custom domain for production

## Support

If you encounter issues:
1. Check Railway documentation: https://docs.railway.app/
2. Review Vercel deployment logs
3. Verify environment variables are correctly set
4. Test database connectivity from Railway console

Your Payment Roster Dashboard should now be fully deployed and integrated between Railway backend/database and Vercel frontend!
