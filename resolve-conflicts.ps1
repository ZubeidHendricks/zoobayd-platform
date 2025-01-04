# Git Conflict Resolution Script

function Resolve-GitConflicts {
    param(
        [string]$BranchName = "feature/collaboration-system",
        [string]$CommitMessage = "Resolve merge conflicts for collaboration system"
    )

    try {
        # Verbose output
        Write-Host "Starting Conflict Resolution Process" -ForegroundColor Cyan
        Write-Host "-----------------------------" -ForegroundColor Cyan

        # Ensure we're in the correct directory
        Write-Host "Changing to repository directory..." -ForegroundColor Yellow
        Set-Location "C:\github_repository\zoobayd-platform"

        # Fetch latest changes
        Write-Host "Fetching latest changes..." -ForegroundColor Yellow
        git fetch origin

        # Checkout the feature branch
        Write-Host "Checking out feature branch..." -ForegroundColor Yellow
        git checkout $BranchName

        # Stage resolved files
        Write-Host "Staging resolved files..." -ForegroundColor Yellow
        git add .env.example
        git add .gitignore

        # Commit resolved conflicts
        Write-Host "Committing resolved conflicts..." -ForegroundColor Yellow
        git commit -m $CommitMessage

        # Push changes
        Write-Host "Pushing resolved conflicts..." -ForegroundColor Yellow
        git push -u origin $BranchName

        Write-Host "Conflict resolution complete!" -ForegroundColor Green

        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    catch {
        Write-Host "Conflict resolution failed: $_" -ForegroundColor Red
        
        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Run the conflict resolution function
Resolve-GitConflicts