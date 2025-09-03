# Render PostgreSQL Database Setup Guide

This guide shows you exactly how to connect to your Render PostgreSQL database and run the schema.

## 📋 Prerequisites

1. **PostgreSQL Client**: Install one of these:
   - **pgAdmin** (Recommended for beginners): https://www.pgadmin.org/download/
   - **DBeaver** (Free universal database tool): https://dbeaver.io/download/
   - **psql** (Command line, if you have PostgreSQL installed locally)

## 🚀 Step-by-Step Database Setup

### Step 1: Get Database Connection Details

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your PostgreSQL service (e.g., `payment-roster-db`)
3. Click the **"Connect"** button
4. Select **"External"** connection method
5. Copy these details:
   - **Host**: `your-db-host.render.com`
   - **Port**: `5432`
   - **Database**: `your-database-name`
   - **Username**: `your-username`
   - **Password**: `your-password`

### Step 2: Connect Using pgAdmin (Easiest Method)

#### Install pgAdmin:
1. Download from: https://www.pgadmin.org/download/
2. Install and open pgAdmin

#### Create Server Connection:
1. Right-click **"Servers"** → **"Create"** → **"Server..."**
2. **General Tab**:
   - Name: `Payment Roster DB`
3. **Connection Tab**:
   - Host name/address: `your-db-host.render.com` (from Step 1)
   - Port: `5432`
   - Maintenance database: `your-database-name` (from Step 1)
   - Username: `your-username` (from Step 1)
   - Password: `your-password` (from Step 1)
4. Click **"Save"**

#### Run the Schema:
1. Expand your server → Expand Databases → Right-click your database
2. Click **"Query Tool"**
3. Copy the entire content from `render-schema.sql`
4. Paste it into the Query Editor
5. Click the **▶️ Execute** button (or press F5)

### Step 3: Alternative - Using DBeaver

#### Install DBeaver:
1. Download from: https://dbeaver.io/download/
2. Install and open DBeaver

#### Create Database Connection:
1. Click **"New Database Connection"**
2. Search for **"PostgreSQL"** and select it
3. **Main Tab**:
   - Host: `your-db-host.render.com`
   - Port: `5432`
   - Database: `your-database-name`
   - Username: `your-username`
   - Password: `your-password`
4. Click **"Test Connection"** to verify
5. Click **"Finish"**

#### Run the Schema:
1. Right-click your connection → **"SQL Editor"** → **"New SQL Script"**
2. Copy content from `render-schema.sql`
3. Click **▶️ Execute SQL Script**

### Step 4: Alternative - Using Command Line (psql)

#### If you have PostgreSQL installed locally:

```bash
# Connect to your Render database
psql "postgresql://username:password@host:5432/database"

# Or use individual parameters
psql -h your-db-host.render.com -p 5432 -U your-username -d your-database-name

# When prompted, enter your password
```

#### Run the schema:
```sql
-- Copy and paste the entire content of render-schema.sql here
-- Then press Ctrl+D (Linux/Mac) or Ctrl+Z (Windows) to execute
```

### Step 5: Alternative - Using Render's Built-in SQL Editor

1. In your Render PostgreSQL service dashboard
2. Click **"Connect"** → **"Internal"**
3. This opens Render's built-in SQL editor
4. Copy the content from `render-schema.sql`
5. Paste and execute

## ✅ Verify Database Setup

After running the schema, verify it worked:

### Using pgAdmin/DBeaver:
1. Expand your database → **Schemas** → **public** → **Tables**
2. You should see:
   - `users` table
   - `payments` table

### Test Query:
```sql
-- Check users table
SELECT * FROM users;

-- Check payments table
SELECT * FROM payments;
```

## 🔧 Troubleshooting

### Connection Issues:

1. **"Connection refused"**:
   - Check if your IP is allowed (Render allows all IPs by default)
   - Verify host, port, and credentials

2. **"Authentication failed"**:
   - Double-check username and password
   - Make sure you're using the external connection credentials

3. **"Database does not exist"**:
   - Use the correct database name from Render dashboard

### Schema Issues:

1. **"Table already exists"**:
   - The schema uses `IF NOT EXISTS`, so this is normal
   - Check if data was inserted

2. **Permission denied**:
   - Make sure you're using the correct user credentials
   - The default user should have full permissions

## 📊 Expected Results

After successful setup, your database should contain:

- **users table**: 3 users (1 admin, 2 employees)
- **payments table**: 2 sample payments
- **Indexes**: Created for performance

## 🧪 Test Your Backend

Once database is set up:

```bash
# Test login
curl -X POST https://your-backend-url.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@paymentroster.com","password":"admin123"}'
```

You should get a JWT token in response!

## 📞 Need Help?

- Render PostgreSQL Docs: https://docs.render.com/postgresql
- pgAdmin Documentation: https://www.pgadmin.org/docs/
- DBeaver Documentation: https://dbeaver.com/docs/

The database setup is complete when you can successfully connect and see the tables with sample data!
