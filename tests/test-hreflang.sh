#!/bin/bash

# tests/test-hreflang.sh
# Checks if hreflang tags are correctly generated in the HTML output.

BASE_URL="http://localhost:8787"
TARGET_URL="$BASE_URL/en/" # Check the English homepage
SUCCESS_COUNT=0
FAIL_COUNT=0

# --- Helper Function ---
assert_tag_present() {
    local html_content=$1
    local tag=$2
    local test_name=$3

    echo -n "🧪 Testing '$test_name'... "
    if echo "$html_content" | grep -q "$tag"; then
        echo "✅ PASSED"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "❌ FAILED (Tag not found: $tag)"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

# --- Test Execution ---
echo "--- Running Hreflang Tag Tests on $TARGET_URL ---"

# Fetch the HTML content of the page
HTML=$(curl --silent --max-time 5 --fail "$TARGET_URL")
if [ $? -ne 0 ]; then
    echo "❌ FAILED - Could not fetch URL: $TARGET_URL"
    exit 1
fi

# 1. Check for the 'en' hreflang tag
assert_tag_present "$HTML" '<link rel="alternate" hreflang="en" href="https://your-domain.com/en/" />' "English hreflang tag"

# 2. Check for the 'fa' hreflang tag
assert_tag_present "$HTML" '<link rel="alternate" hreflang="fa" href="https://your-domain.com/fa/" />' "Persian hreflang tag"

# 3. Check for the 'ar' hreflang tag
assert_tag_present "$HTML" '<link rel="alternate" hreflang="ar" href="https://your-domain.com/ar/" />' "Arabic hreflang tag"

# 4. Check for the 'x-default' hreflang tag
assert_tag_present "$HTML" '<link rel="alternate" hreflang="x-default" href="https://your-domain.com/fa/" />' "x-default hreflang tag"

# 5. Check for the canonical tag
assert_tag_present "$HTML" '<link rel="canonical" href="https://your-domain.com/en/"' "Canonical tag"


# --- Summary ---
echo "-------------------------------------"
echo "✅ Successes: $SUCCESS_COUNT"
echo "❌ Failures: $FAIL_COUNT"
echo "-------------------------------------"

if [ $FAIL_COUNT -ne 0 ]; then
    exit 1
fi
exit 0
