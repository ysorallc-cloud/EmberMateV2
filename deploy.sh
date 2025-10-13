#!/bin/bash

# EmberMate Quick Deploy Script
# This script helps you deploy EmberMate to GitHub and Vercel quickly

echo "🚀 EmberMate Deployment Assistant"
echo "================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   Visit: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " github_username

if [ -z "$github_username" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Configure git if not already configured
if ! git config user.name &> /dev/null; then
    read -p "Enter your name for Git: " user_name
    git config --global user.name "$user_name"
fi

if ! git config user.email &> /dev/null; then
    read -p "Enter your email for Git: " user_email
    git config --global user.email "$user_email"
fi

echo ""
echo "📦 Initializing Git repository..."
git init

echo "➕ Adding files..."
git add .

echo "💾 Creating initial commit..."
git commit -m "Initial commit: EmberMate health tracking app"

echo "🔗 Connecting to GitHub..."
git branch -M main
git remote add origin "https://github.com/$github_username/embermate.git"

echo ""
echo "📤 Ready to push to GitHub!"
echo ""
echo "⚠️  Make sure you've created the 'embermate' repository on GitHub first:"
echo "   1. Go to https://github.com/new"
echo "   2. Repository name: embermate"
echo "   3. Keep it Public or Private (your choice)"
echo "   4. DO NOT initialize with README"
echo "   5. Click 'Create repository'"
echo ""
read -p "Have you created the repository? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing to GitHub..."
    git push -u origin main
    
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next steps:"
    echo "   1. Go to https://vercel.com"
    echo "   2. Sign in with GitHub"
    echo "   3. Click 'New Project'"
    echo "   4. Import 'embermate' repository"
    echo "   5. Click 'Deploy'"
    echo ""
    echo "Your app will be live at: https://embermate.vercel.app"
    echo ""
else
    echo ""
    echo "⏸️  No problem! When you're ready:"
    echo "   1. Create the repository on GitHub"
    echo "   2. Run: git push -u origin main"
    echo ""
fi

echo "📚 For detailed instructions, see GITHUB_SETUP.md"
