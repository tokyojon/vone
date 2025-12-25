#!/bin/bash
SERVER_IP="209.46.120.78"
USER="tokyojon"

echo "🔍 Checking server status..."

ssh $USER@$SERVER_IP << 'EOF'
  echo "--- PM2 Status ---"
  pm2 list

  echo -e "\n--- Listening Ports ---"
  # Try various commands to see what's listening
  lsof -i :3000 || netstat -tuln | grep 3000 || ss -tuln | grep 3000

  echo -e "\n--- Recent Error Logs ---"
  pm2 logs vone --lines 50 --nostream --err

  echo -e "\n--- Process Details ---"
  pm2 show vone
EOF
