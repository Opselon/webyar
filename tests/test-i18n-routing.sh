#!/bin/bash
BASE_URL="http://localhost:8787"
SUCCESS_COUNT=0
FAIL_COUNT=0

assert_contains() {
    local url=$1
    local expected_text=$2
    local test_name=$3
    echo -n "🧪 Testing '$test_name'... "
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

echo "--- Running i18n Routing Tests ---"
redirect_location=$(curl -s -I -L -o /dev/null -w '%{url_effective}' "$BASE_URL/")
if [[ "$redirect_location" == "$BASE_URL/fa/" ]]; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
else
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi

assert_contains "$BASE_URL/fa/" "خدمات سئو مدرن" "Persian Homepage Title"
assert_contains "$BASE_URL/en/" "Modern SEO Services" "English Homepage Title"
assert_contains "$BASE_URL/ar/" "خدمات تحسين محركات البحث الحديثة" "Arabic Homepage Title"

if [ $FAIL_COUNT -ne 0 ]; then exit 1; fi
exit 0
