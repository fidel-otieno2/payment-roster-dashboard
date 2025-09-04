#!/usr/bin/env node

// Simple script to test CORS configuration
const https = require('https');

const backendUrl = 'https://payment-roster-dashboard-3.onrender.com';

console.log('Testing CORS configuration...\n');

// Test 1: Basic connectivity
const testBasic = () => {
  return new Promise((resolve, reject) => {
    https.get(backendUrl, (res) => {
      console.log('✅ Basic connectivity test:');
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}\n`);
      resolve();
    }).on('error', reject);
  });
};

// Test 2: CORS preflight (OPTIONS request)
const testCors = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'payment-roster-dashboard-3.onrender.com',
      path: '/api/login',
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://your-vercel-project.vercel.app', // Replace with your actual Vercel URL
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    };

    const req = https.request(options, (res) => {
      console.log('✅ CORS preflight test:');
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
      console.log(`   Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods']}`);
      console.log(`   Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers']}\n`);
      resolve();
    });

    req.on('error', reject);
    req.end();
  });
};

async function runTests() {
  try {
    await testBasic();
    await testCors();
    console.log('🎉 CORS tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Get your Vercel project URL');
    console.log('2. Add it to the allowedOrigins array in backend/server.js');
    console.log('3. Commit and push the changes');
    console.log('4. Test your frontend deployment');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
