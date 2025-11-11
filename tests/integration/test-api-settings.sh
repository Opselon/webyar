#!/bin/bash
set -e

BASE=${BASE_URL:-http://127.0.0.1:8787}

echo "Checking /api/settings..."
response=$(curl -s -w "%{http_code}" "$BASE/api/settings")
http_code=${response: -3}
body=${response:0:${#response}-3}

if [ "$http_code" -ne 200 ]; then
  echo "❌ Expected a 200 status code from /api/settings, but got $http_code"
  exit 1
fi

echo "✅ /api/settings returned a 200 status code."
echo "🎉 API settings integration tests passed."
