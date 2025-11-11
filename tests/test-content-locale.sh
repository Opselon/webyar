#!/bin/bash
SEED_FILE="./db/seed-content.sql"
SUCCESS_COUNT=0
FAIL_COUNT=0

assert_file_contains() {
    local file_path=$1
    local expected_pattern=$2
    if [ ! -f "$file_path" ]; then
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return
    fi
    if grep -q "$expected_pattern" "$file_path"; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

assert_file_contains "$SEED_FILE" "INSERT INTO posts (lang, slug, title, content, meta_description, created_at) VALUES ('fa', 'technical-seo-guide'"
assert_file_contains "$SEED_FILE" "INSERT INTO posts (lang, slug, title, content, meta_description, created_at) VALUES ('en', 'technical-seo-guide'"
assert_file_contains "$SEED_FILE" "INSERT INTO posts (lang, slug, title, content, meta_description, created_at) VALUES ('ar', 'content-strategy-guide'"
assert_file_contains "$SEED_FILE" "DELETE FROM posts;"

if [ $FAIL_COUNT -ne 0 ]; then exit 1; fi
exit 0
