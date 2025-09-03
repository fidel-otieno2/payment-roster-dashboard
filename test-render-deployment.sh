#!/bin/bash

# Test script for Render deployment
# Usage: ./test-render-deployment.sh <render-backend-url>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <render-backend-url>"
    echo "Example: $0 https://payment-roster-backend.onrender.com"
    exit 1
fi

BACKEND_URL=$1

echo "Testing Render deployment at: $BACKEND_URL"
echo "=========================================="

# Test 1: Backend health check
echo "1. Testing backend health..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/")
if [ "$HEALTH_RESPONSE" -eq 200 ]; then
    echo "✅ Backend is healthy (HTTP $HEALTH_RESPONSE)"
else
    echo "❌ Backend health check failed (HTTP $HEALTH_RESPONSE)"
fi

# Test 2: API endpoint accessibility
echo "2. Testing API endpoints..."
LOGIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/login" -X POST -H "Content-Type: application/json" -d '{"email":"test","password":"test"}')
if [ "$LOGIN_RESPONSE" -eq 400 ]; then
    echo "✅ API endpoints are accessible (HTTP $LOGIN_RESPONSE - expected for invalid credentials)"
else
    echo "❌ API endpoints not accessible (HTTP $LOGIN_RESPONSE)"
fi

# Test 3: Database connectivity (via login attempt)
echo "3. Testing database connectivity..."
# This will fail with invalid credentials but should not give a 500 error if DB is connected
DB_TEST=$(curl -s "$BACKEND_URL/api/login" -X POST -H "Content-Type: application/json" -d '{"email":"nonexistent@example.com","password":"test"}')
if echo "$DB_TEST" | grep -q "User not found"; then
    echo "✅ Database connectivity OK (received expected error for non-existent user)"
elif echo "$DB_TEST" | grep -q "Server error"; then
    echo "❌ Database connectivity issue (server error)"
else
    echo "⚠️  Unexpected response: $DB_TEST"
fi

# Test 4: CORS headers
echo "4. Testing CORS configuration..."
CORS_TEST=$(curl -s -I "$BACKEND_URL/api/login" | grep -i "access-control-allow-origin")
if [ -n "$CORS_TEST" ]; then
    echo "✅ CORS headers present: $CORS_TEST"
else
    echo "❌ CORS headers missing"
fi

echo ""
echo "Test completed!"
echo "If all tests pass, your Render deployment is working correctly."
echo "You can now update your Vercel frontend VITE_API_BASE_URL to: $BACKEND_URL"
