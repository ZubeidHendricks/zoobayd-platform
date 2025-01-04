# Git Push Script for Zoobayd Platform

# Function to push changes
function Push-ZoobayChanges {
    param(
        [string]$BranchName = "feature/backend-infrastructure",
        [string]$CommitMessage = "Add marketplace service and components for contract template marketplace"
    )

    try {
        # Ensure we're in the correct directory
        Set-Location "C:\github_repository\zoobayd-platform"

        # Create and switch to branch
        git checkout -b $BranchName

        # Stage all changes
        git add .

        # Commit changes
        git commit -m $CommitMessage

        # Push to remote repository
        git push -u origin $BranchName

        Write-Host "Successfully pushed changes to $BranchName" -ForegroundColor Green
    }
    catch {
        Write-Host "Error pushing changes: $_" -ForegroundColor Red
    }
}

# Run the push function
Push-ZoobayChanges