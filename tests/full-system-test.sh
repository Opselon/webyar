#!/bin/bash
set -e
echo "🧪 Starting full system test for Cloudflare SEO Project..."

# 1️⃣ نصب و بررسی وابستگی‌ها
echo "📦 Checking dependencies..."
npm ci
npm list itty-router eta wrangler || { echo "❌ Missing core dependencies"; exit 1; }

# 2️⃣ اجرای سرور محلی
echo "🚀 Starting Wrangler Dev..."
npx wrangler dev > test_output.log 2>&1 &
WORKER_PID=$!
sleep 10

# 3️⃣ بررسی سلامت سرور (Health Check)
echo "🔍 Checking local server..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8787)
if [ "$STATUS" == "200" ]; then
    echo "✅ Wrangler Dev running"
else
    echo "❌ Wrangler Dev failed to start properly. Status code: $STATUS"
    cat test_output.log
    kill $WORKER_PID
    exit 1
fi

# 4️⃣ تست Middleware امنیتی
echo "🧱 Testing Auth Middleware..."
REDIRECT_LOCATION=$(curl -s -I http://127.0.0.1:8787/dashboard/posts | grep -i Location)
if [[ "$REDIRECT_LOCATION" == *"/dashboard"* ]]; then
  echo "✅ Auth page redirect is working as expected."
else
  echo "❌ Auth middleware for pages failed. No redirect found."
  kill $WORKER_PID
  exit 1
fi

# 5️⃣ تست‌های دیتابیس
bash tests/test-db-connection.sh || { kill $WORKER_PID; exit 1; }
bash tests/test-db-crud.sh || { kill $WORKER_PID; exit 1; }

# 6️⃣ تست مسیرها، سئو و عملکرد
bash tests/test-endpoints.sh || { kill $WORKER_PID; exit 1; }
bash tests/test-seo.sh || { kill $WORKER_PID; exit 1; }
bash tests/test-performance.sh || { kill $WORKER_PID; exit 1; }

# 7️⃣ توقف Wrangler Dev
echo "🛑 Stopping dev server..."
kill $WORKER_PID

# ✅ نتیجه نهایی
echo "🎯 All system tests passed successfully!"
