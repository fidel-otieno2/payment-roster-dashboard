#!/bin/bash

# Render Database Setup Script
# This script helps you set up your Render PostgreSQL database

echo "🚀 Render Database Setup Script"
echo "================================"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ psql is not installed. Please install PostgreSQL client tools first."
    echo ""
    echo "Installation options:"
    echo "- Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "- macOS: brew install postgresql"
    echo "- Windows: Download from https://www.postgresql.org/download/windows/"
    echo ""
    echo "Alternatively, use pgAdmin or DBeaver as described in render-database-setup.md"
    exit 1
fi

# Get database connection details
echo "Please provide your Render PostgreSQL connection details:"
echo "(You can find these in your Render dashboard → PostgreSQL service → Connect → External)"
echo ""

read -p "Host (e.g., your-db-host.render.com): " DB_HOST
read -p "Port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}
read -p "Database name: " DB_NAME
read -p "Username: " DB_USER
read -s -p "Password: " DB_PASSWORD
echo ""
echo ""

# Test connection
echo "🔍 Testing database connection..."
if psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -c "SELECT version();" &> /dev/null; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed. Please check your credentials."
    exit 1
fi

# Check if tables already exist
echo "🔍 Checking existing tables..."
TABLES=$(psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';" -t)

if echo "$TABLES" | grep -q "users\|payments"; then
    echo "⚠️  Tables already exist. This might overwrite existing data."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Run the schema
echo "📝 Setting up database schema..."
if psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -f render-schema.sql; then
    echo "✅ Database schema setup completed successfully!"
else
    echo "❌ Failed to set up database schema."
    exit 1
fi

# Verify setup
echo "🔍 Verifying setup..."
USER_COUNT=$(psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -c "SELECT COUNT(*) FROM users;" -t)
PAYMENT_COUNT=$(psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -c "SELECT COUNT(*) FROM payments;" -t)

echo ""
echo "📊 Database Summary:"
echo "- Users: $USER_COUNT"
echo "- Payments: $PAYMENT_COUNT"
echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Default login credentials:"
echo "- Admin: admin@paymentroster.com / admin123"
echo "- Employee: john@example.com / admin123"
echo ""
echo "You can now test your backend deployment!"
