#!/bin/bash
set -e

echo "🔗 Testing D1 database connection..."

# Execute a simple query against the D1 database
# Using npx to ensure the local wrangler is used
D1_RESULT=$(npx wrangler d1 execute seo_db --local --command "SELECT 1;" --json | jq -r '.[0].results[0]["1"]')

if [ "$D1_RESULT" == "1" ]; then
  echo "✅ D1 connection OK"
else
  echo "❌ D1 query failed. Result was: $D1_RESULT"
  exit 1
fi
