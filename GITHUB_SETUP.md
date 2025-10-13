# GitHub Setup Guide for EmberMate

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Follow the registration process
4. Verify your email address

## Step 2: Install Git on Your Computer

### Windows
1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer
3. Use default settings (just keep clicking "Next")

### Mac
```bash
# Install using Homebrew (recommended)
brew install git

# Or download from git-scm.com
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get install git

# Fedora
sudo dnf install git
```

## Step 3: Configure Git

Open Terminal (Mac/Linux) or Git Bash (Windows):

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email (use the same email as your GitHub account)
git config --global user.email "your.email@example.com"

# Verify settings
git config --list
```

## Step 4: Create a New Repository on GitHub

1. Log in to [github.com](https://github.com)
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `embermate`
   - **Description**: "Personal health companion app"
   - **Public** or **Private**: Choose based on your preference
   - ❌ **DO NOT** initialize with README (we already have one)
   - ❌ **DO NOT** add .gitignore (we already have one)
5. Click **"Create repository"**

## Step 5: Upload Your Code to GitHub

### Option A: Using Command Line (Recommended)

1. Open Terminal/Git Bash
2. Navigate to your embermate folder:

```bash
cd /path/to/embermate
```

3. Initialize Git repository:

```bash
git init
```

4. Add all files:

```bash
git add .
```

5. Create first commit:

```bash
git commit -m "Initial commit: EmberMate health tracking app"
```

6. Connect to GitHub (replace `yourusername` with your GitHub username):

```bash
git branch -M main
git remote add origin https://github.com/yourusername/embermate.git
```

7. Push to GitHub:

```bash
git push -u origin main
```

You'll be prompted to enter your GitHub credentials.

### Option B: Using GitHub Desktop (Easier for Beginners)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in with your GitHub account
3. Click **"Add"** → **"Add existing repository"**
4. Browse to your `embermate` folder
5. Click **"Publish repository"**
6. Choose Public or Private
7. Click **"Publish"**

### Option C: Using GitHub Web Interface (Simplest)

1. Go to your new repository on GitHub
2. Click **"uploading an existing file"**
3. Drag and drop all files from your embermate folder
4. Scroll down and click **"Commit changes"**

⚠️ **Note**: This method won't maintain your folder structure as well.

## Step 6: Verify Your Code is on GitHub

1. Go to `https://github.com/yourusername/embermate`
2. You should see all your files listed
3. Click on files to preview them

## Step 7: Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** and choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Click **"New Project"**
5. Find and select your `embermate` repository
6. Click **"Import"**
7. Keep default settings and click **"Deploy"**
8. Wait 30-60 seconds
9. 🎉 Your app is live! Click the URL to view it

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /path/to/embermate
vercel

# Follow the prompts:
# - Link to existing project? No
# - What's your project's name? embermate
# - In which directory is your code located? ./
# - Want to override the settings? No

# Deploy to production
vercel --prod
```

## Step 8: Get Your Live URL

After deployment, Vercel will give you URLs like:

- **Production**: `https://embermate.vercel.app`
- **Preview**: `https://embermate-abc123.vercel.app`

## Updating Your App

When you make changes to your code:

```bash
# Add changed files
git add .

# Commit changes
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

Vercel will **automatically redeploy** your app within seconds!

## Troubleshooting

### "Permission denied" when pushing to GitHub

**Solution**: Set up authentication

**Option 1: Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Copy the token
5. Use token as password when pushing

**Option 2: SSH Keys** (More secure)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

### "Git is not recognized" on Windows

**Solution**: Add Git to your PATH or restart your computer after installation

### Can't find the embermate folder

**Solution**: 
```bash
# Create the folder
mkdir -p ~/embermate
cd ~/embermate

# Copy your files here
```

## Need Help?

- [GitHub Documentation](https://docs.github.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Git Basics Tutorial](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)

---

🎉 **Congratulations!** Once you complete these steps, your EmberMate app will be:
- ✅ Version controlled on GitHub
- ✅ Live on the internet via Vercel
- ✅ Automatically deployed when you push changes
- ✅ Accessible from anywhere at your custom URL
