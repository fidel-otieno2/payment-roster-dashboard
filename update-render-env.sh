#!/bin/bash

# Script to update Render environment variables
echo "🔧 Render Environment Variables Update Script"
echo "=============================================="

# Database connection details
DB_HOST="dpg-d2s9ah24d50c73dk08og-a.oregon-postgres.render.com"
DB_DATABASE="my_db_9tgu"
DB_USER="my_db_9tgu_user"
DB_PASSWORD="Z0QzcpRfUV3Gm2CQYJIJ6rRf9ct1TqmV"
DB_PORT="5432"
JWT_SECRET="qvmrb+8r1W3geDdSbx2ee6UX8ZeWvxQ8vKgkXxCmwdkJGuCN3YJ5V3EjJIEkga68me18dS4MrTNyydaURdWlsQ=="

echo "📋 Environment variables to set in Render:"
echo ""
echo "DB_HOST=$DB_HOST"
echo "DB_DATABASE=$DB_DATABASE"
echo "DB_USER=$DB_USER"
echo "DB_PASSWORD=$DB_PASSWORD"
echo "DB_PORT=$DB_PORT"
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo "SUPABASE_URL=your-supabase-url"
echo "SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key"
echo ""

echo "📝 Instructions:"
echo "1. Go to your Render dashboard"
echo "2. Click on your backend service"
echo "3. Go to Settings → Environment"
echo "4. Add each environment variable listed above"
echo "5. Click Save for each one"
echo "6. Redeploy your backend service"
echo ""

echo "⚠️  Important: After updating environment variables, you must redeploy!"
echo "Go to Deployments → Manual Deploy → Deploy latest commit"
