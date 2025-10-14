#!/bin/bash

# EmberMate v2.0 - Automated GitHub Deployment Script
# This script automates the entire deployment process to GitHub

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        EmberMate v2.0 - GitHub Deployment Script         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
REPO_URL="https://github.com/ysorallc-cloud/EmberMateV2.git"
REPO_NAME="EmberMateV2"
BRANCH="main"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo -e "   Repository: ${REPO_URL}"
echo -e "   Branch: ${BRANCH}"
echo -e "   Script Location: ${SCRIPT_DIR}"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Error: Git is not installed${NC}"
    echo -e "   Please install Git first: https://git-scm.com/downloads"
    exit 1
fi

echo -e "${GREEN}✓ Git is installed${NC}"
echo ""

# Step 1: Ask user what they want to do
echo -e "${BLUE}Choose deployment method:${NC}"
echo "  1) Clone repository and update files (Recommended)"
echo "  2) Update existing local repository"
echo "  3) Create deployment package only (no git operations)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo -e "\n${BLUE}═══ Method 1: Clone and Update ═══${NC}\n"
        
        # Ask for directory
        read -p "Enter directory to clone into (default: ~/Desktop): " CLONE_DIR
        CLONE_DIR=${CLONE_DIR:-~/Desktop}
        CLONE_DIR="${CLONE_DIR/#\~/$HOME}"  # Expand ~
        
        # Create directory if it doesn't exist
        mkdir -p "$CLONE_DIR"
        cd "$CLONE_DIR"
        
        # Remove existing directory if it exists
        if [ -d "$REPO_NAME" ]; then
            echo -e "${YELLOW}⚠️  Directory $REPO_NAME already exists${NC}"
            read -p "Remove and re-clone? (y/n): " remove_choice
            if [ "$remove_choice" = "y" ]; then
                rm -rf "$REPO_NAME"
                echo -e "${GREEN}✓ Removed existing directory${NC}"
            else
                echo -e "${RED}❌ Aborted${NC}"
                exit 1
            fi
        fi
        
        # Clone repository
        echo -e "\n${BLUE}📥 Cloning repository...${NC}"
        git clone "$REPO_URL"
        cd "$REPO_NAME"
        
        REPO_DIR="$PWD"
        ;;
        
    2)
        echo -e "\n${BLUE}═══ Method 2: Update Existing Repository ═══${NC}\n"
        
        read -p "Enter path to your local repository: " REPO_DIR
        REPO_DIR="${REPO_DIR/#\~/$HOME}"  # Expand ~
        
        if [ ! -d "$REPO_DIR" ]; then
            echo -e "${RED}❌ Error: Directory does not exist${NC}"
            exit 1
        fi
        
        cd "$REPO_DIR"
        
        # Check if it's a git repository
        if [ ! -d ".git" ]; then
            echo -e "${RED}❌ Error: Not a git repository${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✓ Found git repository${NC}"
        
        # Check for uncommitted changes
        if [[ -n $(git status -s) ]]; then
            echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
            git status -s
            read -p "Continue anyway? (y/n): " continue_choice
            if [ "$continue_choice" != "y" ]; then
                echo -e "${RED}❌ Aborted${NC}"
                exit 1
            fi
        fi
        ;;
        
    3)
        echo -e "\n${BLUE}═══ Method 3: Create Package Only ═══${NC}\n"
        
        read -p "Enter directory to create package in (default: ~/Desktop): " PACKAGE_DIR
        PACKAGE_DIR=${PACKAGE_DIR:-~/Desktop}
        PACKAGE_DIR="${PACKAGE_DIR/#\~/$HOME}"
        
        mkdir -p "$PACKAGE_DIR/embermate-v2-ready"
        
        echo -e "${BLUE}📦 Copying files...${NC}"
        cp "$SCRIPT_DIR"/*.html "$PACKAGE_DIR/embermate-v2-ready/" 2>/dev/null || true
        cp "$SCRIPT_DIR"/*.css "$PACKAGE_DIR/embermate-v2-ready/" 2>/dev/null || true
        cp "$SCRIPT_DIR"/*.js "$PACKAGE_DIR/embermate-v2-ready/" 2>/dev/null || true
        cp "$SCRIPT_DIR"/*.json "$PACKAGE_DIR/embermate-v2-ready/" 2>/dev/null || true
        cp "$SCRIPT_DIR"/*.md "$PACKAGE_DIR/embermate-v2-ready/" 2>/dev/null || true
        cp "$SCRIPT_DIR"/*.txt "$PACKAGE_DIR/embermate-v2-ready/" 2>/dev/null || true
        
        echo -e "${GREEN}✓ Package created at: $PACKAGE_DIR/embermate-v2-ready${NC}"
        echo -e "${BLUE}You can now manually upload these files to GitHub${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

# Step 2: Copy new files
echo -e "\n${BLUE}📋 Copying updated files...${NC}"

# Copy main files
files_to_copy=(
    "landing.html"
    "landing-styles.css"
    "landing-script.js"
    "index.html"
    "app.js"
    "styles.css"
    "package.json"
    "vercel.json"
)

for file in "${files_to_copy[@]}"; do
    if [ -f "$SCRIPT_DIR/$file" ]; then
        cp "$SCRIPT_DIR/$file" .
        echo -e "   ${GREEN}✓${NC} Copied $file"
    else
        echo -e "   ${YELLOW}⚠${NC}  $file not found (skipping)"
    fi
done

# Copy README (rename from README-NEW.md)
if [ -f "$SCRIPT_DIR/README-NEW.md" ]; then
    cp "$SCRIPT_DIR/README-NEW.md" ./README.md
    echo -e "   ${GREEN}✓${NC} Copied README-NEW.md → README.md"
fi

# Copy documentation files
echo -e "\n${BLUE}📚 Copying documentation...${NC}"
doc_files=(
    "QUICK_START.txt"
    "IMPROVEMENT_SUMMARY.md"
    "DEPLOYMENT_GUIDE.md"
    "BEFORE_AFTER_COMPARISON.md"
    "COMPLETE_SUMMARY.md"
    "INDEX.md"
    "START_HERE.md"
    "FILES_LIST.txt"
)

for file in "${doc_files[@]}"; do
    if [ -f "$SCRIPT_DIR/$file" ]; then
        cp "$SCRIPT_DIR/$file" .
        echo -e "   ${GREEN}✓${NC} Copied $file"
    fi
done

# Step 3: Git operations
echo -e "\n${BLUE}📊 Checking repository status...${NC}"
git status

echo -e "\n${YELLOW}The following changes will be committed:${NC}"
git status -s

read -p "Continue with commit? (y/n): " commit_choice
if [ "$commit_choice" != "y" ]; then
    echo -e "${RED}❌ Aborted${NC}"
    exit 1
fi

# Step 4: Add files
echo -e "\n${BLUE}➕ Adding files to git...${NC}"
git add .
echo -e "${GREEN}✓ Files added${NC}"

# Step 5: Commit
echo -e "\n${BLUE}💾 Creating commit...${NC}"
git commit -m "feat: EmberMate v2.0 - Complete redesign

- Add professional landing page with modern design
- Complete deidentification of all personal information
- Enhance navigation with smooth scroll and mobile menu
- Add 8 comprehensive documentation guides
- Update to fully responsive design (mobile/tablet/desktop)
- Improve user onboarding and flow experience
- Add deployment guides for 5 platforms
- Update to v2.0.0 with enhanced features"

echo -e "${GREEN}✓ Commit created${NC}"

# Step 6: Show current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "\n${BLUE}Current branch: ${CURRENT_BRANCH}${NC}"

# Step 7: Push
echo -e "\n${YELLOW}Ready to push to GitHub!${NC}"
echo -e "This will push to: ${REPO_URL}"
echo -e "Branch: ${CURRENT_BRANCH}"
echo ""
read -p "Push now? (y/n): " push_choice

if [ "$push_choice" = "y" ]; then
    echo -e "\n${BLUE}🚀 Pushing to GitHub...${NC}"
    
    # Try to push
    if git push origin "$CURRENT_BRANCH"; then
        echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                  🎉 SUCCESS! 🎉                           ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
        echo -e "\n${GREEN}✓ Successfully pushed to GitHub!${NC}"
        echo -e "\n${BLUE}Your repository:${NC} https://github.com/ysorallc-cloud/EmberMateV2"
        echo -e "${BLUE}View your site:${NC} Open landing.html from the repository"
        
        # Ask about deployment
        echo -e "\n${YELLOW}Would you like to deploy to Vercel now?${NC}"
        read -p "(y/n): " deploy_choice
        if [ "$deploy_choice" = "y" ]; then
            if command -v vercel &> /dev/null; then
                echo -e "\n${BLUE}🚀 Deploying to Vercel...${NC}"
                vercel --prod
            else
                echo -e "${YELLOW}Vercel CLI not installed. Install with: npm i -g vercel${NC}"
            fi
        fi
    else
        echo -e "\n${RED}❌ Push failed${NC}"
        echo -e "${YELLOW}This might be because:${NC}"
        echo -e "  1. You need to authenticate with GitHub"
        echo -e "  2. You don't have push permissions"
        echo -e "  3. The branch is protected"
        echo -e "\n${BLUE}Manual push command:${NC}"
        echo -e "  git push origin $CURRENT_BRANCH"
        exit 1
    fi
else
    echo -e "\n${YELLOW}Push skipped. You can manually push later with:${NC}"
    echo -e "  cd $REPO_DIR"
    echo -e "  git push origin $CURRENT_BRANCH"
fi

echo -e "\n${GREEN}✓ All done!${NC}"
echo ""
