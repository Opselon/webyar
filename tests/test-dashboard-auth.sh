#!/bin/bash
set -e
echo "🔐 Testing Dashboard Authentication..."

# Start the worker in the background
npx wrangler dev > /dev/null 2>&1 &
WORKER_PID=$!
sleep 5 # Give it time to start

BASE_URL="http://localhost:8787"
PROTECTED_ENDPOINT="$BASE_URL/api/dashboard/status"

# 1. Test without authentication
echo "  - Testing access without credentials..."
STATUS_NO_AUTH=$(curl -s -o /dev/null -w "%{http_code}" "$PROTECTED_ENDPOINT")
if [ "$STATUS_NO_AUTH" == "401" ]; then
  echo "    ✅ Received 401 Unauthorized as expected."
else
  echo "    ❌ Expected 401 but received $STATUS_NO_AUTH."
  kill $WORKER_PID
  exit 1
fi

# 2. Test with authentication (using default dev credentials)
echo "  - Testing access with valid credentials..."
# The user:pass is admin:password
AUTH_HEADER="Authorization: Basic $(echo -n 'admin:password' | base64)"
STATUS_WITH_AUTH=$(curl -s -o /dev/null -w "%{http_code}" -H "$AUTH_HEADER" "$PROTECTED_ENDPOINT")
if [ "$STATUS_WITH_AUTH" == "200" ]; then
  echo "    ✅ Received 200 OK as expected."
else
  echo "    ❌ Expected 200 but received $STATUS_WITH_AUTH."
  kill $WORKER_PID
  exit 1
fi


# Cleanup: stop the worker
kill $WORKER_PID
echo "✅ Dashboard Authentication tests passed."
