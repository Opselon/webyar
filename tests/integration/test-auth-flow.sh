#!/bin/bash
set -e

BASE=${BASE_URL:-http://127.0.0.1:8787}

echo "Checking for redirect on /dashboard..."
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/dashboard")

if [ "$status_code" -eq 302 ] || [ "$status_code" -eq 303 ]; then
  echo "✅ Correctly redirected from /dashboard with status $status_code"
else
  echo "❌ Expected a 302 or 303 redirect from /dashboard, but got $status_code"
  exit 1
fi

echo "🎉 Auth flow integration tests passed."
