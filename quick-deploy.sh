#!/bin/bash

# EmberMate v2.0 - Quick Deploy Script
# Ultra-simple version - just run this!

echo "🚀 EmberMate v2.0 - Quick Deploy"
echo "================================"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Ask for repository path
echo "Where is your EmberMateV2 repository?"
echo "(Press Enter for ~/Desktop/EmberMateV2)"
read -p "Path: " REPO_PATH

# Default path
if [ -z "$REPO_PATH" ]; then
    REPO_PATH="$HOME/Desktop/EmberMateV2"
fi

# Check if repository exists
if [ ! -d "$REPO_PATH" ]; then
    echo "❌ Repository not found at: $REPO_PATH"
    echo ""
    echo "Do you want to clone it now?"
    read -p "(y/n): " clone_choice
    
    if [ "$clone_choice" = "y" ]; then
        CLONE_DIR=$(dirname "$REPO_PATH")
        mkdir -p "$CLONE_DIR"
        cd "$CLONE_DIR"
        git clone https://github.com/ysorallc-cloud/EmberMateV2.git
        cd EmberMateV2
    else
        exit 1
    fi
else
    cd "$REPO_PATH"
fi

echo ""
echo "📋 Copying files..."

# Copy all files
cp "$SCRIPT_DIR"/*.html . 2>/dev/null
cp "$SCRIPT_DIR"/*.css . 2>/dev/null
cp "$SCRIPT_DIR"/*.js . 2>/dev/null
cp "$SCRIPT_DIR"/*.json . 2>/dev/null
cp "$SCRIPT_DIR"/*.txt . 2>/dev/null
cp "$SCRIPT_DIR"/README-NEW.md ./README.md 2>/dev/null
cp "$SCRIPT_DIR"/*.md . 2>/dev/null

echo "✓ Files copied"
echo ""
echo "📊 Status:"
git status -s

echo ""
read -p "Commit and push? (y/n): " confirm

if [ "$confirm" = "y" ]; then
    git add .
    git commit -m "feat: EmberMate v2.0 - Complete redesign with landing page"
    git push origin main
    echo ""
    echo "✅ Done! Check your repository:"
    echo "https://github.com/ysorallc-cloud/EmberMateV2"
else
    echo "Skipped. Run these commands manually:"
    echo "  git add ."
    echo "  git commit -m 'feat: EmberMate v2.0'"
    echo "  git push origin main"
fi
