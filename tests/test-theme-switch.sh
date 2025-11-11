#!/bin/bash
set -e
echo "🎨 Testing Theme System Integration..."

npx wrangler dev > /dev/null 2>&1 &
WORKER_PID=$!
sleep 5

BASE_URL="http://localhost:8787"
HOMEPAGE_CONTENT=$(curl -s "$BASE_URL")

# Check if the theme initialization script exists in the <head>
if echo "$HOMEPAGE_CONTENT" | grep -q "window.localStorage.getItem('theme')"; then
  echo "  ✅ Theme initialization script found."
else
  echo "  ❌ Theme initialization script is missing."
  kill $WORKER_PID
  exit 1
fi

# Check if the theme toggle button exists
if echo "$HOMEPAGE_CONTENT" | grep -q 'id="theme-toggle"'; then
  echo "  ✅ Theme toggle button found."
else
  echo "  ❌ Theme toggle button is missing."
  kill $WORKER_PID
  exit 1
fi

kill $WORKER_PID
echo "✅ Basic theme system tests passed."
