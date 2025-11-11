#!/bin/bash
set -e
echo "🔎 Testing SEO metadata..."

BASE_URL="http://127.0.0.1:8787"

# Fetch homepage content
HOMEPAGE_CONTENT=$(curl -s "$BASE_URL")

# 1. Check for <title> tag
if echo "$HOMEPAGE_CONTENT" | grep -q -i "<title>.*</title>"; then
  echo "  ✅ Homepage has a <title> tag."
else
  echo "  ❌ Homepage is missing a <title> tag."
  exit 1
fi

# 2. Check for <meta name="description">
if echo "$HOMEPAGE_CONTENT" | grep -q -i '<meta\s+name="description"'; then
  echo "  ✅ Homepage has a meta description."
else
  echo "  ❌ Homepage is missing a meta description."
  exit 1
fi

# 3. Check for <link rel="canonical">
if echo "$HOMEPAGE_CONTENT" | grep -q -i '<link\s+rel="canonical"'; then
  echo "  ✅ Homepage has a canonical link."
else
  echo "  ❌ Homepage is missing a canonical link."
  exit 1
fi

echo "✅ Basic SEO metadata tests passed."
