#!/bin/bash

# --- Configuration ---
SERVER_IP="209.46.120.78"
USER="tokyojon"
REMOTE_DIR="/var/www/oneness"
PM2_APP_NAME="vone"

# Text Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting deployment to $USER@$SERVER_IP...${NC}"

# 1. Create remote directory if it doesn't exist
# We use sudo mkdir in case /var/www doesn't exist or needs root, but tokyojon needs to own it.
# This assumes tokyojon has rights or the dir already exists.
echo -e "${GREEN}📁 Ensuring remote directory exists...${NC}"
ssh $USER@$SERVER_IP "mkdir -p $REMOTE_DIR"

# 2. Sync files
echo -e "${GREEN}📦 Transferring files via rsync...${NC}"
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.DS_Store' \
  --exclude '__MACOSX' \
  --exclude 'deploy.sh' \
  --exclude '.vscode' \
  ./ $USER@$SERVER_IP:$REMOTE_DIR

# 3. Upload Environment Variables
if [ -f .env.local ]; then
  echo -e "${GREEN}🔑 Uploading .env.local...${NC}"
  rsync -avz .env.local $USER@$SERVER_IP:$REMOTE_DIR/.env.local
else
  echo -e "${YELLOW}⚠️  WARNING: .env.local not found! Application may crash.${NC}"
fi

# 4. Remote Execution
echo -e "${GREEN}🛠  Building and launching on server...${NC}"
ssh $USER@$SERVER_IP << 'EOF'
  # Define variables inside remote session
  REMOTE_DIR="/var/www/oneness"
  PM2_APP_NAME="vone"
  
  # Function to install Node if missing
  ensure_node() {
    if ! command -v node &> /dev/null; then
      echo "📦 Node.js not detected. Installing NVM and Node.js LTS..."
      export NVM_DIR="$HOME/.nvm"
      
      # Install NVM
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
      
      # Load NVM
      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
      
      # Install Node
      nvm install 20
      nvm use 20
      nvm alias default 20
      
      # Install Global PM2
      npm install -g pm2
    else
      echo "✅ Node.js is already installed: $(node -v)"
    fi
  }

  # Load NVM if it exists
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

  ensure_node

  cd $REMOTE_DIR

  echo "📥 Installing dependencies..."
  npm install --production=false

  echo "🏗  Building Next.js application..."
  npm run build

  echo "🚀 Managing process with PM2..."
  if command -v pm2 &> /dev/null; then
    # Start or Restart using ecosystem file if present
    if [ -f ecosystem.config.js ]; then
      pm2 startOrReload ecosystem.config.js
    else
      pm2 start npm --name "$PM2_APP_NAME" -- start
    fi
    pm2 save
    echo "✅ Application deployed successfully!"
  else
    # Fallback if PM2 install failed for some reason
    echo "⚠️  PM2 missing. Installing locally and starting..."
    npm install pm2 -g
    pm2 startOrReload ecosystem.config.js
  fi
EOF

echo -e "${GREEN}✨ Deployment Complete! Live at http://$SERVER_IP:3000${NC}"
