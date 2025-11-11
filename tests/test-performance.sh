#!/bin/bash
set -e
echo "⏱️ Running basic performance test..."

BASE_URL="http://127.0.0.1:8787"
# TTFB threshold in seconds (e.g., 0.8 seconds)
TTFB_THRESHOLD=0.8

# Get the Time to First Byte (TTFB) for the homepage
TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" "$BASE_URL")

echo "  - Measured TTFB: ${TTFB}s"

# Compare with the threshold
# bc is used for floating point comparison
if (( $(echo "$TTFB < $TTFB_THRESHOLD" | bc -l) )); then
  echo "  ✅ TTFB is within the acceptable threshold (< ${TTFB_THRESHOLD}s)."
else
  echo "  ❌ TTFB of ${TTFB}s exceeds the threshold of ${TTFB_THRESHOLD}s."
  exit 1
fi

echo "✅ Basic performance test passed."
