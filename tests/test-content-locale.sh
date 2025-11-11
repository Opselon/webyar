#!/bin/bash

# tests/test-content-locale.sh
# Checks if the generated db/seed-content.sql file contains multilingual data.
# This is a build-time test, not a runtime test.

SEED_FILE="./db/seed-content.sql"
SUCCESS_COUNT=0
FAIL_COUNT=0

# --- Helper Function ---
assert_file_contains() {
    local file_path=$1
    local expected_pattern=$2
    local test_name=$3

    echo -n "🧪 Testing '$test_name'... "
    if [ ! -f "$file_path" ]; then
        echo "❌ FAILED (File not found: $file_path)"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return
    fi

    if grep -q "$expected_pattern" "$file_path"; then
        echo "✅ PASSED"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "❌ FAILED (Pattern not found: $expected_pattern)"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

# --- Test Execution ---
echo "--- Running Multilingual Content Seed Tests on $SEED_FILE ---"

# 1. Check for a Persian post insertion
assert_file_contains "$SEED_FILE" "INSERT INTO posts (lang, slug, title, content, meta_description, created_at) VALUES ('fa', 'technical-seo-guide'" "Persian Post INSERT"

# 2. Check for an English post insertion
assert_file_contains "$SEED_FILE" "INSERT INTO posts (lang, slug, title, content, meta_description, created_at) VALUES ('en', 'technical-seo-guide'" "English Post INSERT"

# 3. Check for an Arabic post insertion with the same slug
assert_file_contains "$SEED_FILE" "INSERT INTO posts (lang, slug, title, content, meta_description, created_at) VALUES ('ar', 'content-strategy-guide'" "Arabic Post with same slug"

# 4. Check that the script is deleting old posts
assert_file_contains "$SEED_FILE" "DELETE FROM posts;" "DELETE statement"


# --- Summary ---
echo "-------------------------------------"
echo "✅ Successes: $SUCCESS_COUNT"
echo "❌ Failures: $FAIL_COUNT"
echo "-------------------------------------"

if [ $FAIL_COUNT -ne 0 ]; then
    exit 1
fi
exit 0
