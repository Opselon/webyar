#!/bin/bash
set -e
echo "🤖 Testing AI Audit and Recommendations API..."

# This test reuses the existing analytics endpoint test, as it covers the core logic.
bash tests/test-analytics-endpoints.sh
