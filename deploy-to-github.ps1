# EmberMate v2.0 - Automated GitHub Deployment Script (Windows)
# PowerShell script for Windows users

$ErrorActionPreference = "Stop"

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║        EmberMate v2.0 - GitHub Deployment Script         ║" -ForegroundColor Blue
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# Configuration
$REPO_URL = "https://github.com/ysorallc-cloud/EmberMateV2.git"
$REPO_NAME = "EmberMateV2"
$BRANCH = "main"
$SCRIPT_DIR = $PSScriptRoot

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Repository: $REPO_URL"
Write-Host "   Branch: $BRANCH"
Write-Host "   Script Location: $SCRIPT_DIR"
Write-Host ""

# Check if git is installed
try {
    $null = git --version
    Write-Host "✓ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Git is not installed" -ForegroundColor Red
    Write-Host "   Please install Git first: https://git-scm.com/downloads"
    exit 1
}
Write-Host ""

# Step 1: Ask user what they want to do
Write-Host "Choose deployment method:" -ForegroundColor Blue
Write-Host "  1) Clone repository and update files (Recommended)"
Write-Host "  2) Update existing local repository"
Write-Host "  3) Create deployment package only (no git operations)"
Write-Host ""
$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "`n═══ Method 1: Clone and Update ═══`n" -ForegroundColor Blue
        
        # Ask for directory
        $CLONE_DIR = Read-Host "Enter directory to clone into (default: Desktop)"
        if ([string]::IsNullOrWhiteSpace($CLONE_DIR)) {
            $CLONE_DIR = [Environment]::GetFolderPath("Desktop")
        }
        
        # Create directory if it doesn't exist
        New-Item -ItemType Directory -Force -Path $CLONE_DIR | Out-Null
        Set-Location $CLONE_DIR
        
        # Remove existing directory if it exists
        if (Test-Path $REPO_NAME) {
            Write-Host "⚠️  Directory $REPO_NAME already exists" -ForegroundColor Yellow
            $remove_choice = Read-Host "Remove and re-clone? (y/n)"
            if ($remove_choice -eq "y") {
                Remove-Item -Recurse -Force $REPO_NAME
                Write-Host "✓ Removed existing directory" -ForegroundColor Green
            } else {
                Write-Host "❌ Aborted" -ForegroundColor Red
                exit 1
            }
        }
        
        # Clone repository
        Write-Host "`n📥 Cloning repository..." -ForegroundColor Blue
        git clone $REPO_URL
        Set-Location $REPO_NAME
        
        $REPO_DIR = Get-Location
    }
    
    "2" {
        Write-Host "`n═══ Method 2: Update Existing Repository ═══`n" -ForegroundColor Blue
        
        $REPO_DIR = Read-Host "Enter path to your local repository"
        
        if (-not (Test-Path $REPO_DIR)) {
            Write-Host "❌ Error: Directory does not exist" -ForegroundColor Red
            exit 1
        }
        
        Set-Location $REPO_DIR
        
        # Check if it's a git repository
        if (-not (Test-Path ".git")) {
            Write-Host "❌ Error: Not a git repository" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "✓ Found git repository" -ForegroundColor Green
        
        # Check for uncommitted changes
        $status = git status --porcelain
        if ($status) {
            Write-Host "⚠️  You have uncommitted changes" -ForegroundColor Yellow
            git status -s
            $continue_choice = Read-Host "Continue anyway? (y/n)"
            if ($continue_choice -ne "y") {
                Write-Host "❌ Aborted" -ForegroundColor Red
                exit 1
            }
        }
    }
    
    "3" {
        Write-Host "`n═══ Method 3: Create Package Only ═══`n" -ForegroundColor Blue
        
        $PACKAGE_DIR = Read-Host "Enter directory to create package in (default: Desktop)"
        if ([string]::IsNullOrWhiteSpace($PACKAGE_DIR)) {
            $PACKAGE_DIR = [Environment]::GetFolderPath("Desktop")
        }
        
        $PACKAGE_PATH = Join-Path $PACKAGE_DIR "embermate-v2-ready"
        New-Item -ItemType Directory -Force -Path $PACKAGE_PATH | Out-Null
        
        Write-Host "📦 Copying files..." -ForegroundColor Blue
        
        # Copy files
        Get-ChildItem $SCRIPT_DIR -Filter "*.html" | Copy-Item -Destination $PACKAGE_PATH -ErrorAction SilentlyContinue
        Get-ChildItem $SCRIPT_DIR -Filter "*.css" | Copy-Item -Destination $PACKAGE_PATH -ErrorAction SilentlyContinue
        Get-ChildItem $SCRIPT_DIR -Filter "*.js" | Copy-Item -Destination $PACKAGE_PATH -ErrorAction SilentlyContinue
        Get-ChildItem $SCRIPT_DIR -Filter "*.json" | Copy-Item -Destination $PACKAGE_PATH -ErrorAction SilentlyContinue
        Get-ChildItem $SCRIPT_DIR -Filter "*.md" | Copy-Item -Destination $PACKAGE_PATH -ErrorAction SilentlyContinue
        Get-ChildItem $SCRIPT_DIR -Filter "*.txt" | Copy-Item -Destination $PACKAGE_PATH -ErrorAction SilentlyContinue
        
        Write-Host "✓ Package created at: $PACKAGE_PATH" -ForegroundColor Green
        Write-Host "You can now manually upload these files to GitHub" -ForegroundColor Blue
        exit 0
    }
    
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Copy new files
Write-Host "`n📋 Copying updated files..." -ForegroundColor Blue

$files_to_copy = @(
    "landing.html",
    "landing-styles.css",
    "landing-script.js",
    "index.html",
    "app.js",
    "styles.css",
    "package.json",
    "vercel.json"
)

foreach ($file in $files_to_copy) {
    $source = Join-Path $SCRIPT_DIR $file
    if (Test-Path $source) {
        Copy-Item $source . -Force
        Write-Host "   ✓ Copied $file" -ForegroundColor Green
    } else {
        Write-Host "   ⚠  $file not found (skipping)" -ForegroundColor Yellow
    }
}

# Copy README
$readme_source = Join-Path $SCRIPT_DIR "README-NEW.md"
if (Test-Path $readme_source) {
    Copy-Item $readme_source "README.md" -Force
    Write-Host "   ✓ Copied README-NEW.md → README.md" -ForegroundColor Green
}

# Copy documentation
Write-Host "`n📚 Copying documentation..." -ForegroundColor Blue
$doc_files = @(
    "QUICK_START.txt",
    "IMPROVEMENT_SUMMARY.md",
    "DEPLOYMENT_GUIDE.md",
    "BEFORE_AFTER_COMPARISON.md",
    "COMPLETE_SUMMARY.md",
    "INDEX.md",
    "START_HERE.md",
    "FILES_LIST.txt"
)

foreach ($file in $doc_files) {
    $source = Join-Path $SCRIPT_DIR $file
    if (Test-Path $source) {
        Copy-Item $source . -Force
        Write-Host "   ✓ Copied $file" -ForegroundColor Green
    }
}

# Step 3: Git operations
Write-Host "`n📊 Checking repository status..." -ForegroundColor Blue
git status

Write-Host "`nThe following changes will be committed:" -ForegroundColor Yellow
git status -s

$commit_choice = Read-Host "`nContinue with commit? (y/n)"
if ($commit_choice -ne "y") {
    Write-Host "❌ Aborted" -ForegroundColor Red
    exit 1
}

# Step 4: Add files
Write-Host "`n➕ Adding files to git..." -ForegroundColor Blue
git add .
Write-Host "✓ Files added" -ForegroundColor Green

# Step 5: Commit
Write-Host "`n💾 Creating commit..." -ForegroundColor Blue
$commit_message = @"
feat: EmberMate v2.0 - Complete redesign

- Add professional landing page with modern design
- Complete deidentification of all personal information
- Enhance navigation with smooth scroll and mobile menu
- Add 8 comprehensive documentation guides
- Update to fully responsive design (mobile/tablet/desktop)
- Improve user onboarding and flow experience
- Add deployment guides for 5 platforms
- Update to v2.0.0 with enhanced features
"@

git commit -m $commit_message
Write-Host "✓ Commit created" -ForegroundColor Green

# Step 6: Show current branch
$CURRENT_BRANCH = git branch --show-current
Write-Host "`nCurrent branch: $CURRENT_BRANCH" -ForegroundColor Blue

# Step 7: Push
Write-Host "`nReady to push to GitHub!" -ForegroundColor Yellow
Write-Host "This will push to: $REPO_URL"
Write-Host "Branch: $CURRENT_BRANCH"
Write-Host ""
$push_choice = Read-Host "Push now? (y/n)"

if ($push_choice -eq "y") {
    Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Blue
    
    try {
        git push origin $CURRENT_BRANCH
        
        Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║                  🎉 SUCCESS! 🎉                           ║" -ForegroundColor Green
        Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host "`n✓ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "`nYour repository: https://github.com/ysorallc-cloud/EmberMateV2" -ForegroundColor Blue
        Write-Host "View your site: Open landing.html from the repository" -ForegroundColor Blue
        
        # Ask about deployment
        Write-Host "`nWould you like to deploy to Vercel now?" -ForegroundColor Yellow
        $deploy_choice = Read-Host "(y/n)"
        if ($deploy_choice -eq "y") {
            try {
                $null = vercel --version
                Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Blue
                vercel --prod
            } catch {
                Write-Host "Vercel CLI not installed. Install with: npm i -g vercel" -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "`n❌ Push failed" -ForegroundColor Red
        Write-Host "This might be because:" -ForegroundColor Yellow
        Write-Host "  1. You need to authenticate with GitHub"
        Write-Host "  2. You don't have push permissions"
        Write-Host "  3. The branch is protected"
        Write-Host "`nManual push command:" -ForegroundColor Blue
        Write-Host "  git push origin $CURRENT_BRANCH"
        exit 1
    }
} else {
    Write-Host "`nPush skipped. You can manually push later with:" -ForegroundColor Yellow
    Write-Host "  cd $REPO_DIR"
    Write-Host "  git push origin $CURRENT_BRANCH"
}

Write-Host "`n✓ All done!" -ForegroundColor Green
Write-Host ""
