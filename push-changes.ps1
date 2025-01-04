# Git Push Script for Zoobayd Platform

# Function to push changes
function Push-ZoobayChanges {
    param(
        [string]$BranchName = "feature/collaboration-system",
        [string]$CommitMessage = "Add collaborative contract development system with real-time editing and AI insights"
    )

    try {
        # Verbose output
        Write-Host "Starting Git Push Process" -ForegroundColor Cyan
        Write-Host "-----------------------------" -ForegroundColor Cyan

        # Ensure we're in the correct directory
        Write-Host "Changing to repository directory..." -ForegroundColor Yellow
        Set-Location "C:\github_repository\zoobayd-platform"

        # Check current branch and state
        Write-Host "Current Git Status:" -ForegroundColor Yellow
        git status

        # Create and switch to branch
        Write-Host "`nCreating and switching to branch: $BranchName" -ForegroundColor Yellow
        git checkout -b $BranchName

        # Stage all changes
        Write-Host "`nStaging all changes..." -ForegroundColor Yellow
        git add .

        # Show what will be committed
        Write-Host "`nFiles to be committed:" -ForegroundColor Yellow
        git status --short

        # Commit changes
        Write-Host "`nCommitting changes..." -ForegroundColor Yellow
        git commit -m $CommitMessage

        # Push to remote repository
        Write-Host "`nPushing to remote repository..." -ForegroundColor Yellow
        git push -u origin $BranchName

        Write-Host "`nSuccessfully pushed changes to $BranchName" -ForegroundColor Green

        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    catch {
        Write-Host "Error pushing changes: $_" -ForegroundColor Red
        
        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Run the push function
Push-ZoobayChanges