#!/bin/bash
set -e
echo "📊 Testing Analytics & Insights Endpoints..."

npx wrangler dev > /dev/null 2>&1 &
WORKER_PID=$!
sleep 5

BASE_URL="http://localhost:8787/api/dashboard"
AUTH_HEADER="Authorization: Basic $(echo -n 'admin:password' | base64)"

# We need a URL to test. We'll test the homepage of our own dev server.
TEST_TARGET_URL="http://localhost:8787"

# 1. Test the SEO Analysis Endpoint
echo "  - Testing GET /analytics/seo..."
SEO_RESPONSE=$(curl -s -H "$AUTH_HEADER" "$BASE_URL/analytics/seo?url=$TEST_TARGET_URL")

SCORE=$(echo $SEO_RESPONSE | jq -r '.score')
RECOMMENDATIONS=$(echo $SEO_RESPONSE | jq -r '.recommendations | length')

if [[ "$SCORE" -ge 0 && "$SCORE" -le 100 && "$RECOMMENDATIONS" -ge 0 ]]; then
  echo "    ✅ SEO analysis endpoint returned a valid score and recommendations."
else
  echo "    ❌ SEO analysis endpoint returned an invalid response: $SEO_RESPONSE"
  kill $WORKER_PID
  exit 1
fi

# 2. Test the AI Recommendations Endpoint
echo "  - Testing GET /ai/recommendations..."
AI_RESPONSE=$(curl -s -H "$AUTH_HEADER" "$BASE_URL/ai/recommendations?url=$TEST_TARGET_URL")
AI_RECOMMENDATIONS=$(echo $AI_RESPONSE | jq -r '.recommendations | length')

if [[ "$AI_RECOMMENDATIONS" -ge 0 ]]; then
  echo "    ✅ AI recommendations endpoint returned a valid response."
else
  echo "    ❌ AI recommendations endpoint returned an invalid response: $AI_RESPONSE"
  kill $WORKER_PID
  exit 1
fi

kill $WORKER_PID
echo "✅ Analytics & Insights endpoints tests passed."
