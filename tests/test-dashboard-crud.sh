#!/bin/bash
set -e
echo "🔄 Testing Dashboard CRUD API..."

npx wrangler dev > /dev/null 2>&1 &
WORKER_PID=$!
sleep 5

BASE_URL="http://localhost:8787/api/dashboard"
AUTH_HEADER="Authorization: Basic $(echo -n 'admin:password' | base64)"

# 1. Create a post
echo "  - Testing POST /posts..."
CREATED_POST=$(curl -s -X POST "$BASE_URL/posts" \
    -H "$AUTH_HEADER" \
    -H "Content-Type: application/json" \
    -d '{"title":"API Test","slug":"api-test","status":"draft"}')

POST_ID=$(echo $CREATED_POST | jq -r '.id')
if [ -z "$POST_ID" ] || [ "$POST_ID" == "null" ]; then
    echo "    ❌ Failed to create post. Response: $CREATED_POST"
    kill $WORKER_PID
    exit 1
fi
echo "    ✅ Post created with ID: $POST_ID"

# 2. Read the post
echo "  - Testing GET /posts/:id..."
FETCHED_POST=$(curl -s -H "$AUTH_HEADER" "$BASE_URL/posts/$POST_ID")
FETCHED_SLUG=$(echo $FETCHED_POST | jq -r '.slug')
if [ "$FETCHED_SLUG" != "api-test" ]; then
    echo "    ❌ Failed to fetch the correct post."
    kill $WORKER_PID
    exit 1
fi
echo "    ✅ Post fetched successfully."

# 3. Update the post
echo "  - Testing PUT /posts/:id..."
UPDATED_POST=$(curl -s -X PUT "$BASE_URL/posts/$POST_ID" \
    -H "$AUTH_HEADER" \
    -H "Content-Type: application/json" \
    -d '{"title":"API Test Updated","slug":"api-test-updated","status":"published"}')
UPDATED_SLUG=$(echo $UPDATED_POST | jq -r '.slug')
if [ "$UPDATED_SLUG" != "api-test-updated" ]; then
    echo "    ❌ Failed to update post."
    kill $WORKER_PID
    exit 1
fi
echo "    ✅ Post updated successfully."


# 4. Delete the post
echo "  - Testing DELETE /posts/:id..."
DELETE_RESPONSE=$(curl -s -X DELETE -H "$AUTH_HEADER" "$BASE_URL/posts/$POST_ID")
DELETE_SUCCESS_MSG=$(echo $DELETE_RESPONSE | jq -r '.message')
if [[ "$DELETE_SUCCESS_MSG" != "Post deleted successfully" ]]; then
    echo "    ❌ Failed to delete post."
    kill $WORKER_PID
    exit 1
fi
echo "    ✅ Post deleted successfully."


kill $WORKER_PID
echo "✅ Dashboard CRUD API tests passed."
