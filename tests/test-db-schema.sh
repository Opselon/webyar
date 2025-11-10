#!/bin/bash
set -e
echo "🧩 Checking D1 schema..."

# Use the standard SQL query to list tables from sqlite_master
TABLES=$(npx wrangler d1 execute seo_db --local --command "SELECT name FROM sqlite_master WHERE type='table';" --json | jq -r '.[0].results[].name' 2>/dev/null || echo "")

if [ -z "$TABLES" ]; then
    echo "❌ Could not fetch tables from D1 database."
    exit 1
fi

# List of required tables
REQUIRED_TABLES=("posts" "users" "settings")

for table in "${REQUIRED_TABLES[@]}"; do
  echo "$TABLES" | grep -q "^$table$" || { echo "❌ Missing required table: $table"; exit 1; }
done

echo "✅ D1 schema OK (found all required tables)"
