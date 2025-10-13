
#!/bin/bash

# 🚀 EmberMate Automated Deployment Script
# This script automates the deployment process with built-in monitoring

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="embermate"
DEPLOY_ENV="production"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   EmberMate Deployment Automation     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Pre-deployment checks
echo -e "${YELLOW}[1/6] Running pre-deployment checks...${NC}"

if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Error: index.html not found${NC}"
    exit 1
fi

if [ ! -f "app.js" ]; then
    echo -e "${RED}❌ Error: app.js not found${NC}"
    exit 1
fi

if [ ! -f "styles.css" ]; then
    echo -e "${RED}❌ Error: styles.css not found${NC}"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ Error: vercel.json not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required files present${NC}"
echo ""

# Step 2: Check Git status
echo -e "${YELLOW}[2/6] Checking Git status...${NC}"

if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Git repository detected${NC}"
    
    # Check for uncommitted changes
    if [[ -n $(git status -s) ]]; then
        echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
        echo "Would you like to commit them? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            git add .
            echo "Enter commit message:"
            read -r commit_msg
            git commit -m "$commit_msg"
            echo -e "${GREEN}✅ Changes committed${NC}"
        fi
    else
        echo -e "${GREEN}✅ No uncommitted changes${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Not a Git repository${NC}"
fi
echo ""

# Step 3: Validate configuration
echo -e "${YELLOW}[3/6] Validating vercel.json...${NC}"

if ! jq empty vercel.json 2>/dev/null; then
    echo -e "${RED}❌ Invalid JSON in vercel.json${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration valid${NC}"
echo ""

# Step 4: Deploy to Vercel
echo -e "${YELLOW}[4/6] Deploying to Vercel...${NC}"

if command -v vercel &> /dev/null; then
    echo "Starting deployment..."
    
    # Deploy and capture output
    if vercel --prod --yes; then
        echo -e "${GREEN}✅ Deployment successful!${NC}"
    else
        echo -e "${RED}❌ Deployment failed!${NC}"
        echo "Check the logs above for details."
        exit 1
    fi
else
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo "Install it with: npm i -g vercel"
    exit 1
fi
echo ""

# Step 5: Post-deployment checks
echo -e "${YELLOW}[5/6] Running post-deployment checks...${NC}"

echo "Waiting 5 seconds for deployment to propagate..."
sleep 5

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls $PROJECT_NAME --json 2>/dev/null | jq -r '.[0].url' 2>/dev/null || echo "")

if [ -n "$DEPLOYMENT_URL" ]; then
    FULL_URL="https://$DEPLOYMENT_URL"
    echo -e "${GREEN}✅ Deployment URL: $FULL_URL${NC}"
    
    # Check if site is reachable
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FULL_URL")
    
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo -e "${GREEN}✅ Site is live and responding!${NC}"
    else
        echo -e "${YELLOW}⚠️  Site returned HTTP $HTTP_CODE${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Could not retrieve deployment URL${NC}"
fi
echo ""

# Step 6: Summary
echo -e "${YELLOW}[6/6] Deployment Summary${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Project:      ${BLUE}$PROJECT_NAME${NC}"
echo -e "Environment:  ${BLUE}$DEPLOY_ENV${NC}"
echo -e "Status:       ${GREEN}✅ Deployed${NC}"
echo -e "URL:          ${BLUE}$FULL_URL${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Optional: Open in browser
echo "Would you like to open the site in your browser? (y/n)"
read -r open_response
if [[ "$open_response" =~ ^[Yy]$ ]]; then
    if [ -n "$FULL_URL" ]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "$FULL_URL"
        elif command -v open &> /dev/null; then
            open "$FULL_URL"
        else
            echo "Please open this URL manually: $FULL_URL"
        fi
    fi
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Test the live site thoroughly"
echo "  2. Check Vercel dashboard for analytics"
echo "  3. Set up monitoring (see MONITORING_GUIDE.md)"
echo ""
echo "For monitoring tips, run: cat MONITORING_GUIDE.md"
