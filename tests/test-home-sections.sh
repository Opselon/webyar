#!/bin/bash
set -e
echo "🔎 Testing Homepage Sections..."

npx wrangler dev > /dev/null 2>&1 &
WORKER_PID=$!
sleep 5

BASE_URL="http://localhost:8787"
HOMEPAGE_CONTENT=$(curl -s "$BASE_URL")

# Define sections to check for (using a unique string from each component)
SECTIONS=(
  "رتبه سایت خود را به اوج برسانید"  # Hero Section
  "خدمات تخصصی ما"                  # Services Section
  "مشتریان ما چه می‌گویند؟"       # Testimonials Section
  "آخرین مطالب وبلاگ"               # Blog Preview Section
)

for section_text in "${SECTIONS[@]}"; do
  if echo "$HOMEPAGE_CONTENT" | grep -q "$section_text"; then
    echo "  ✅ Section found: $section_text"
  else
    echo "  ❌ Missing required section: $section_text"
    kill $WORKER_PID
    exit 1
  fi
done

kill $WORKER_PID
echo "✅ All homepage sections are present."
