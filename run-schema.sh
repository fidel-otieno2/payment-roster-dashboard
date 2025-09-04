#!/bin/bash

# Direct schema execution script
echo "🚀 Running Payment Roster Database Schema..."

# Database connection details (update these if needed)
HOST="dpg-d2s9ah24d50c73dk08og-a.oregon-postgres.render.com"
DATABASE="my_db_9tgu"
USERNAME="my_db_9tgu_user"
PASSWORD="Z0QzcpRfUV3Gm2CQYJIJ6rRf9ct1TqmV"

# Set password for psql
export PGPASSWORD="$PASSWORD"

echo "📝 Setting up database schema..."
if psql -h "$HOST" -U "$USERNAME" -d "$DATABASE" -f render-schema.sql; then
    echo "✅ Database schema setup completed successfully!"
else
    echo "❌ Failed to set up database schema."
    exit 1
fi

# Verify setup
echo "🔍 Verifying setup..."
USER_COUNT=$(psql -h "$HOST" -U "$USERNAME" -d "$DATABASE" -c "SELECT COUNT(*) FROM users;" -t)
PAYMENT_COUNT=$(psql -h "$HOST" -U "$USERNAME" -d "$DATABASE" -c "SELECT COUNT(*) FROM payments;" -t)

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
