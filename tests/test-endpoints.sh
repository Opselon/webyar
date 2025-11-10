#!/bin/bash
set -e
echo "🔗 Testing main application endpoints..."

BASE_URL="http://127.0.0.1:8787"
ENDPOINTS=("/" "/services" "/pricing" "/blog" "/contact" "/case-studies" "/tools" "/faq")

for endpoint in "${ENDPOINTS[@]}"; do
  URL="$BASE_URL$endpoint"
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
  if [ "$STATUS" == "200" ]; then
    echo "  ✅ Endpoint $endpoint responded with 200 OK."
  else
    echo "  ❌ Endpoint $endpoint failed with status $STATUS."
    exit 1
  fi
done

echo "✅ All main endpoints are accessible."
