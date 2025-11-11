#!/bin/bash
set -e

BASE=${BASE_URL:-http://127.0.0.1:8787}

check_page() {
  local path="$1"
  echo "Checking $path..."
  html=$(curl -s "$BASE$path")
  echo "$html" | grep -q "<title>" || { echo "❌ Missing <title> in $path"; exit 1; }
  echo "$html" | grep -q "<h1" || { echo "❌ Missing <h1> in $path"; exit 1; }
  echo "✅ $path OK"
}

check_page "/"
check_page "/services"
check_page "/pricing"
check_page "/blog"
check_page "/contact"

echo "🎉 SSR integration tests passed."
