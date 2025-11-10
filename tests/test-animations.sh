#!/bin/bash
set -e
echo "🎬 Testing Animations Integration..."

npx wrangler dev > /dev/null 2>&1 &
WORKER_PID=$!
sleep 5

BASE_URL="http://localhost:8787"
HOMEPAGE_CONTENT=$(curl -s "$BASE_URL")

# 1. Check for the scroll-animate class in a component
if echo "$HOMEPAGE_CONTENT" | grep -q 'class=".*scroll-animate'; then
  echo "  ✅ '.scroll-animate' class found in components."
else
  echo "  ❌ '.scroll-animate' class is missing from homepage components."
  kill $WORKER_PID
  exit 1
fi

# 2. Check for the IntersectionObserver script
if echo "$HOMEPAGE_CONTENT" | grep -q 'new IntersectionObserver'; then
  echo "  ✅ IntersectionObserver script is present."
else
  echo "  ❌ IntersectionObserver script is missing."
  kill $WORKER_PID
  exit 1
fi

# 3. Check for the Lottie lazy-load script
if echo "$HOMEPAGE_CONTENT" | grep -q 'lottie-container'; then
  echo "  ✅ Lottie lazy-load container found."
else
  echo "  ❌ Lottie lazy-load container is missing."
  kill $WORKER_PID
  exit 1
fi


kill $WORKER_PID
echo "✅ Basic animation integration tests passed."
