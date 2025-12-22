#!/bin/bash

# Helper script to create .env.local with your Supabase credentials

echo "Creating .env.local file..."

cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://mvivdndbuyfzsbtszqir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_v7RZRATLU8KtKpXpyjUung_ATIOpvtn
EOF

if [ -f .env.local ]; then
    echo "✅ .env.local created successfully!"
    echo ""
    echo "You can now run:"
    echo "  npm run dev"
else
    echo "❌ Failed to create .env.local"
fi
