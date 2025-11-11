#!/bin/bash
set -e
echo "🔄 Testing D1 CRUD operations..."

# Generate a unique slug for this test run to avoid collisions
TEST_SLUG="test-post-$(date +%s)"

# 1. Create (Insert) a new post
echo "  - Testing INSERT..."
npx wrangler d1 execute seo_db --local --command "INSERT INTO posts (title, slug, content) VALUES ('CRUD Test Post', '$TEST_SLUG', 'This is a test.');"

# 2. Read (Select) the created post
echo "  - Testing SELECT..."
ROW_COUNT=$(npx wrangler d1 execute seo_db --local --command "SELECT COUNT(*) as c FROM posts WHERE slug='$TEST_SLUG';" --json | jq -r '.[0].results[0].c')
if [ "$ROW_COUNT" == "1" ]; then
  echo "    ✅ Insert and Select successful."
else
  echo "    ❌ SELECT query failed to find the new post."
  exit 1
fi

# 3. Delete the post to clean up
echo "  - Testing DELETE..."
npx wrangler d1 execute seo_db --local --command "DELETE FROM posts WHERE slug='$TEST_SLUG';"

# Verify deletion
ROW_COUNT_AFTER_DELETE=$(npx wrangler d1 execute seo_db --local --command "SELECT COUNT(*) as c FROM posts WHERE slug='$TEST_SLUG';" --json | jq -r '.[0].results[0].c')
if [ "$ROW_COUNT_AFTER_DELETE" == "0" ]; then
  echo "    ✅ Delete successful."
else
  echo "    ❌ DELETE query failed to remove the test post."
  exit 1
fi

echo "✅ D1 CRUD operations OK"
