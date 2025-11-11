#!/bin/bash
set -e
echo "🌊 Testing Streaming Response..."

npx wrangler dev > /dev/null 2>&1 &
WORKER_PID=$!
sleep 5

BASE_URL="http://localhost:8787"

# Fetch headers and check for 'Transfer-Encoding: chunked'
HEADERS=$(curl -s -I "$BASE_URL")

if echo "$HEADERS" | grep -q -i "Transfer-Encoding: chunked"; then
  echo "  ✅ Response is streamed (Transfer-Encoding: chunked)."
else
  # As a fallback, check if there's no Content-Length, which also implies streaming
  if ! echo "$HEADERS" | grep -q -i "Content-Length"; then
    echo "  ✅ Response is likely streamed (no Content-Length)."
  else
    echo "  ❌ Response does not appear to be streamed."
    kill $WORKER_PID
    exit 1
  fi
fi

kill $WORKER_PID
echo "✅ Streaming response test passed."
