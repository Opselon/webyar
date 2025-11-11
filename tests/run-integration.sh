#!/bin/bash
set -e

# Start wrangler dev in the background
npm start > wrangler_output.log 2>&1 &
DEV_PID=$!

# Wait for the server to be ready
echo "Waiting for server to become available..."
n=0
until [ "$n" -ge 20 ]; do
  curl -s http://127.0.0.1:8787 > /dev/null && break
  n=$((n+1))
  sleep 1
done

if ! curl -s http://127.0.0.1:8787 > /dev/null; then
  echo "❌ Server failed to start. Aborting tests."
  kill $DEV_PID || true
  exit 1
fi

echo "✅ Server is up. Running tests..."

# Run the integration tests
bash tests/integration/test-ssr.sh
bash tests/integration/test-auth-flow.sh
bash tests/integration/test-api-posts.sh
bash tests/integration/test-api-settings.sh

# Kill the server
kill $DEV_PID || true

echo "🎉 All integration tests passed."
