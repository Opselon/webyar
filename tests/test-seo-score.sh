#!/bin/bash
set -e
echo "💯 Testing SEO Score Calculation..."

# This test reuses the main analytics endpoint test but focuses only on the score.
# In a real CI, you might run these in parallel or sequence.
bash tests/test-analytics-endpoints.sh
