#!/bin/bash
BASE_URL="http://localhost:8787"
TARGET_URL="$BASE_URL/en/"
SUCCESS_COUNT=0
FAIL_COUNT=0

assert_tag_present() {
    local html_content=$1
    local tag=$2
    echo -n "🧪 Testing for tag '$tag'... "
    if echo "$html_content" | grep -q "$tag"; then
        echo "✅ PASSED"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "❌ FAILED"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

HTML=$(curl --silent --max-time 5 --fail "$TARGET_URL")
if [ $? -ne 0 ]; then exit 1; fi

assert_tag_present "$HTML" '<link rel="alternate" hreflang="en" href="https://your-domain.com/en/" />'
assert_tag_present "$HTML" '<link rel="alternate" hreflang="fa" href="https://your-domain.com/fa/" />'
assert_tag_present "$HTML" '<link rel="alternate" hreflang="ar" href="https://your-domain.com/ar/" />'
assert_tag_present "$HTML" '<link rel="alternate" hreflang="x-default" href="https://your-domain.com/fa/" />'
assert_tag_present "$HTML" '<link rel="canonical" href="https://your-domain.com/en/"'

if [ $FAIL_COUNT -ne 0 ]; then exit 1; fi
exit 0
