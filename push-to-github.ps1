function Push-ZoobayCode {
    param(
        [string]$CommitMessage = "Comprehensive platform update: Backend, Frontend, and CI/CD setup",
        [string]$BranchName = "main"
    )

    try {
        # Change to the repository directory
        Set-Location "C:\github_repository\zoobayd-platform"

        # Configure git user (if not already configured)
        git config --global user.name "Zoobayd Platform Bot"
        git config --global user.email "support@zoobayd.com"

        # Add all changes
        git add .

        # Check if there are any changes to commit
        $changes = git status --porcelain
        if ($changes) {
            # Commit changes
            git commit -m "$CommitMessage"

            # Pull latest changes to avoid conflicts
            git pull origin $BranchName --rebase

            # Push to remote repository
            git push origin $BranchName

            Write-Host "Successfully pushed changes to $BranchName branch" -ForegroundColor Green
        }
        else {
            Write-Host "No changes to commit" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Error pushing code: $_" -ForegroundColor Red
    }
}

# Run the push function
Push-ZoobayCode