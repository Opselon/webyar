#!/bin/bash

# tests/test-sitemap-locale.sh
# Checks if the sitemap.xml contains multilingual URLs and xhtml:link tags.

BASE_URL="http://localhost:8787"
SITEMAP_URL="$BASE_URL/sitemap.xml"
SUCCESS_COUNT=0
FAIL_COUNT=0

# --- Helper Function ---
assert_sitemap_contains() {
    local sitemap_content=$1
    local expected_pattern=$2
    local test_name=$3

    echo -n "🧪 Testing '$test_name'... "
    # Use grep with -q for quiet mode. The pattern is a regex.
    if echo "$sitemap_content" | grep -q "$expected_pattern"; then
        echo "✅ PASSED"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "❌ FAILED (Pattern not found: $expected_pattern)"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

# --- Test Execution ---
echo "--- Running Sitemap Locale Tests on $SITEMAP_URL ---"

# Fetch the XML content of the sitemap
SITEMAP_XML=$(curl --silent --max-time 5 --fail "$SITEMAP_URL")
if [ $? -ne 0 ]; then
    echo "❌ FAILED - Could not fetch URL: $SITEMAP_URL"
    exit 1
fi

# 1. Check for the main <urlset> tag with xhtml namespace
assert_sitemap_contains "$SITEMAP_XML" '<urlset .*xmlns:xhtml="http://www.w3.org/1999/xhtml">' "Sitemap XML namespace"

# 2. Check for the primary <loc> for the homepage (should be the 'fa' version)
assert_sitemap_contains "$SITEMAP_XML" '<loc>https://your-domain.com/fa/</loc>' "Primary homepage <loc>"

# 3. Check for an English alternate link for the homepage
assert_sitemap_contains "$SITEMAP_XML" '<xhtml:link.*hreflang="en".*href="https://your-domain.com/en/".*/>' "English alternate link for homepage"

# 4. Check for an Arabic alternate link for the services page
assert_sitemap_contains "$SITEMAP_XML" '<xhtml:link.*hreflang="ar".*href="https://your-domain.com/ar/services".*/>' "Arabic alternate link for services page"

# 5. Check for the x-default link for the blog page
assert_sitemap_contains "$SITEMAP_XML" '<xhtml:link.*hreflang="x-default".*href="https://your-domain.com/fa/blog".*/>' "x-default link for blog page"


# --- Summary ---
echo "-------------------------------------"
echo "✅ Successes: $SUCCESS_COUNT"
echo "❌ Failures: $FAIL_COUNT"
echo "-------------------------------------"

if [ $FAIL_COUNT -ne 0 ]; then
    exit 1
fi
exit 0
