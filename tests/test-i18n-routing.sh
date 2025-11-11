#!/bin/bash

# tests/test-i18n-routing.sh
# Checks if the localized routes are working and return language-specific content.

BASE_URL="http://localhost:8787"
SUCCESS_COUNT=0
FAIL_COUNT=0

# --- Helper Function ---
assert_contains() {
    local url=$1
    local expected_text=$2
    local test_name=$3

    echo -n "🧪 Testing '$test_name'... "

    # Use curl to fetch the page content
    # --silent: Don't show progress meter
    # --max-time 5: Timeout after 5 seconds
    # --fail: Fail silently on HTTP errors (return exit code 22)
    local response=$(curl --silent --max-time 5 --fail "$url")

    if [ $? -ne 0 ]; then
        echo "❌ FAILED (Curl command failed)"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return
    fi

    if echo "$response" | grep -q "$expected_text"; then
        echo "✅ PASSED"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "❌ FAILED (Did not find '$expected_text')"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

# --- Test Cases ---
echo "--- Running i18n Routing Tests ---"

# 1. Test Root Redirect
echo -n "🧪 Testing root redirect '/' -> '/fa'... "
# -I to fetch headers, -L to follow redirects
redirect_location=$(curl -s -I -L -o /dev/null -w '%{url_effective}' "$BASE_URL/")
if [[ "$redirect_location" == "$BASE_URL/fa/" ]]; then
    echo "✅ PASSED"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
else
    echo "❌ FAILED (Expected redirect to /fa/, got $redirect_location)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi

# 2. Test Persian Homepage
assert_contains "$BASE_URL/fa/" "خدمات سئو مدرن" "Persian Homepage Title"

# 3. Test English Homepage
assert_contains "$BASE_URL/en/" "Modern SEO Services" "English Homepage Title"

# 4. Test Arabic Homepage
assert_contains "$BASE_URL/ar/" "خدمات تحسين محركات البحث الحديثة" "Arabic Homepage Title"

# 5. Test a nested page (Services)
assert_contains "$BASE_URL/en/services" "Our Services" "English Services Page"
assert_contains "$BASE_URL/fa/services" "خدمات ما" "Persian Services Page"

# --- Summary ---
echo "-------------------------------------"
echo "✅ Successes: $SUCCESS_COUNT"
echo "❌ Failures: $FAIL_COUNT"
echo "-------------------------------------"

if [ $FAIL_COUNT -ne 0 ]; then
    exit 1
fi
exit 0
