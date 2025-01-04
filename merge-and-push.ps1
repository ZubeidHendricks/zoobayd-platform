# Git Merge and Push Script for Zoobayd Platform

function Merge-AndPushToMain {
    param(
        [string]$FeatureBranch = "feature/collaboration-system",
        [string]$CommitMessage = "Merge collaboration system into main branch"
    )

    try {
        # Verbose output
        Write-Host "Starting Merge and Push Process" -ForegroundColor Cyan
        Write-Host "-----------------------------" -ForegroundColor Cyan

        # Ensure we're in the correct directory
        Write-Host "Changing to repository directory..." -ForegroundColor Yellow
        Set-Location "C:\github_repository\zoobayd-platform"

        # Stage all changes
        Write-Host "Staging all changes..." -ForegroundColor Yellow
        git add .

        # Commit changes
        Write-Host "Committing changes..." -ForegroundColor Yellow
        git commit -m $CommitMessage

        # Fetch latest changes
        Write-Host "Fetching latest changes..." -ForegroundColor Yellow
        git fetch origin

        # Checkout main branch
        Write-Host "Switching to main branch..." -ForegroundColor Yellow
        git checkout main

        # Pull latest main branch
        Write-Host "Pulling latest main branch..." -ForegroundColor Yellow
        git pull origin main

        # Merge feature branch into main
        Write-Host "Merging feature branch into main..." -ForegroundColor Yellow
        git merge $FeatureBranch

        # Push to main branch
        Write-Host "Pushing to main branch..." -ForegroundColor Green
        git push origin main

        Write-Host "Merge and push complete!" -ForegroundColor Green

        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    catch {
        Write-Host "Merge and push failed: $_" -ForegroundColor Red
        
        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Run the merge and push function
Merge-AndPushToMain