#!/bin/bash
set -e
echo "🛂 Testing Cache Policy..."

npx wrangler dev > /dev/null 2>&1 &
WORKER_PID=$!
sleep 5

BASE_URL="http://localhost:8787"

# Fetch headers for the homepage
HEADERS=$(curl -s -I "$BASE_URL")

# Check for the Cache-Control header
if echo "$HEADERS" | grep -q -i "Cache-Control: public"; then
  echo "  ✅ Cache-Control header contains 'public'."
else
  echo "  ❌ Cache-Control header is missing or not 'public'."
  kill $WORKER_PID
  exit 1
fi

if echo "$HEADERS" | grep -q -i "stale-while-revalidate"; then
  echo "  ✅ Cache-Control header contains 'stale-while-revalidate'."
else
  echo "  ❌ Cache-Control header is missing 'stale-while-revalidate'."
  kill $WORKER_PID
  exit 1
fi

kill $WORKER_PID
echo "✅ Cache policy tests passed."
