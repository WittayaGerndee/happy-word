#!/bin/sh
# อัปเว็บขึ้น Cloudflare Workers — ใช้คำสั่งเดียว:  ./deploy.sh
# (ครั้งแรกจะให้ล็อกอิน Cloudflare ในเบราว์เซอร์ ครั้งต่อไปไม่ต้องแล้ว)
set -e
cd "$(dirname "$0")"
echo "→ กำลังอัปขึ้น Cloudflare..."
npx --yes wrangler@latest deploy
echo ""
echo "✅ เสร็จแล้ว — เช็คว่าขึ้นตัวใหม่จริงไหมที่:"
echo "   https://happy-word.wittaya-gerndee.workers.dev/version.txt"
echo "   ต้องขึ้นเลข: $(cat version.txt)"
