#!/bin/bash
set -e
echo "🔄 Testing D1 CRUD operations for Case Studies..."

# Generate a unique slug for this test run
TEST_SLUG="test-case-study-$(date +%s)"

# 1. Create (Insert) a new case study
echo "  - Testing INSERT..."
npx wrangler d1 execute seo_db --local --command "INSERT INTO case_studies (title, slug, client) VALUES ('Test Case Study', '$TEST_SLUG', 'Test Client');"

# 2. Read (Select) the created case study
echo "  - Testing SELECT..."
ROW_COUNT=$(npx wrangler d1 execute seo_db --local --command "SELECT COUNT(*) as c FROM case_studies WHERE slug='$TEST_SLUG';" --json | jq -r '.[0].results[0].c')
if [ "$ROW_COUNT" == "1" ]; then
  echo "    ✅ Insert and Select successful."
else
  echo "    ❌ SELECT query failed to find the new case study."
  exit 1
fi

# 3. Delete the case study to clean up
echo "  - Testing DELETE..."
npx wrangler d1 execute seo_db --local --command "DELETE FROM case_studies WHERE slug='$TEST_SLUG';"

# Verify deletion
ROW_COUNT_AFTER_DELETE=$(npx wrangler d1 execute seo_db --local --command "SELECT COUNT(*) as c FROM case_studies WHERE slug='$TEST_SLUG';" --json | jq -r '.[0].results[0].c')
if [ "$ROW_COUNT_AFTER_DELETE" == "0" ]; then
  echo "    ✅ Delete successful."
else
  echo "    ❌ DELETE query failed to remove the test case study."
  exit 1
fi

echo "✅ D1 CRUD operations for Case Studies OK"
