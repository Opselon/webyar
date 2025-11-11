#!/bin/bash
BASE_URL="http://localhost:8787"
SITEMAP_URL="$BASE_URL/sitemap.xml"
SUCCESS_COUNT=0
FAIL_COUNT=0

assert_sitemap_contains() {
    local sitemap_content=$1
    local expected_pattern=$2
    if echo "$sitemap_content" | grep -q "$expected_pattern"; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

SITEMAP_XML=$(curl --silent --max-time 5 --fail "$SITEMAP_URL")
if [ $? -ne 0 ]; then exit 1; fi

assert_sitemap_contains "$SITEMAP_XML" '<urlset .*xmlns:xhtml="http://www.w3.org/1999/xhtml">'
assert_sitemap_contains "$SITEMAP_XML" '<loc>https://your-domain.com/fa/</loc>'
assert_sitemap_contains "$SITEMAP_XML" '<xhtml:link.*hreflang="en".*href="https://your-domain.com/en/".*/>'
assert_sitemap_contains "$SITEMAP_XML" '<xhtml:link.*hreflang="ar".*href="https://your-domain.com/ar/services".*/>'
assert_sitemap_contains "$SITEMAP_XML" '<xhtml:link.*hreflang="x-default".*href="https://your-domain.com/fa/blog".*/>'

if [ $FAIL_COUNT -ne 0 ]; then exit 1; fi
exit 0
