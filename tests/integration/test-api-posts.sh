#!/bin/bash
set -e

BASE=${BASE_URL:-http://127.0.0.1:8787}

echo "Checking /api/posts..."
response=$(curl -s -w "%{http_code}" "$BASE/api/posts")
http_code=${response: -3}
body=${response:0:${#response}-3}

if [ "$http_code" -ne 200 ]; then
  echo "❌ Expected a 200 status code from /api/posts, but got $http_code"
  exit 1
fi

echo "✅ /api/posts returned a 200 status code."
echo "🎉 API posts integration tests passed."
