#!/bin/bash
# --------------------------------------------------------------------------------
# Test Script for Stage 7: Build & Content Pipeline
# --------------------------------------------------------------------------------

set -e # Exit immediately if a command exits with a non-zero status.

# --- Test Variables ---
MANIFEST_PATH="assets/manifest.json"
ICON_DIR="assets/icons"
ICON_SIZES=(64 128 256 512)
JSON_DIR="assets/json"
JSON_FILES=("testimonials.json" "case-studies.json")
SQL_SEED_FILE="db/seed-content.sql"

# --- Helper Functions ---
echo_color() {
    local color_code=$1
    local text=$2
    echo -e "\033[${color_code}m${text}\033[0m"
}

assert_file_exists() {
    if [ ! -f "$1" ]; then
        echo_color "31" "❌ Assertion failed: File '$1' does not exist."
        exit 1
    fi
    echo_color "32" "✅ Assertion passed: File '$1' exists."
}

assert_dir_exists() {
    if [ ! -d "$1" ]; then
        echo_color "31" "❌ Assertion failed: Directory '$1' does not exist."
        exit 1
    fi
    echo_color "32" "✅ Assertion passed: Directory '$1' exists."
}

# --- Test Execution ---

echo_color "35" "🚀 Starting Test: Build & Content Pipeline Verification"

# 1. Test Asset Generation (`npm run build:assets`)
echo_color "36" "\n🔬 Step 1: Testing Asset Generation ('npm run build:assets')..."
npm run build:assets

# Verify manifest and icons
assert_file_exists $MANIFEST_PATH
assert_dir_exists $ICON_DIR
for size in "${ICON_SIZES[@]}"; do
    assert_file_exists "${ICON_DIR}/logo-${size}.png"
done

# Verify manifest content using grep (simple check)
if ! grep -q '"name": "Modern SEO Services"' $MANIFEST_PATH; then
    echo_color "31" "❌ Assertion failed: manifest.json does not contain the correct app name."
    exit 1
fi
echo_color "32" "✅ Assertion passed: manifest.json content seems correct."
echo_color "32" "🎉 Step 1 Complete: Asset generation verified successfully."

# 2. Test Content Seeding (`npm run seed:content`)
echo_color "36" "\n🔬 Step 2: Testing Content Seeding ('npm run seed:content')..."
# First, ensure the schema exists
echo "Initializing D1 database schema..."
npx wrangler d1 execute seo_db --local --file=./db/schema.sql > /dev/null

# Now, run the content seeder
echo "Running the content seeding script..."
npm run build:content
npm run db:seed

# Verify generated files
assert_file_exists $SQL_SEED_FILE
for file in "${JSON_FILES[@]}"; do
    assert_file_exists "${JSON_DIR}/${file}"
done
echo_color "32" "✅ Assertion passed: SQL and JSON seed files were generated."

# Verify data in D1 database
echo "Querying D1 database to verify seeded content..."
POST_COUNT=$(npx wrangler d1 execute seo_db --local --command="SELECT COUNT(*) FROM posts;")
TESTIMONIAL_COUNT=$(npx wrangler d1 execute seo_db --local --command="SELECT COUNT(*) FROM testimonials;")

# The expected output from wrangler is a JSON-like string. We use grep to find the count.
# The key from wrangler is "COUNT(*)", so we need to match that specific pattern, escaping the '*' for grep.
if ! echo "$POST_COUNT" | grep -q '"COUNT(\*)": 2'; then
    echo_color "31" "❌ Database assertion failed: Expected 2 posts, but found a different number."
    echo "D1 Output: $POST_COUNT"
    exit 1
fi
echo_color "32" "✅ Database assertion passed: Found 2 posts as expected."

if ! echo "$TESTIMONIAL_COUNT" | grep -q '"COUNT(\*)": 2'; then
    echo_color "31" "❌ Database assertion failed: Expected 2 testimonials, but found a different number."
    echo "D1 Output: $TESTIMONIAL_COUNT"
    exit 1
fi
echo_color "32" "✅ Database assertion passed: Found 2 testimonials as expected."

echo_color "32" "🎉 Step 2 Complete: Content seeding verified successfully."

echo_color "35" "\n✨ All Build & Content Pipeline tests passed successfully! ✨"

exit 0
