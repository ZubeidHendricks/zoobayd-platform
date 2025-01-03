function Push-ZoobayChanges {
    param(
        [string]$CommitMessage = "Comprehensive platform update: Advanced services implementation",
        [string]$BranchName = "feature/advanced-services"
    )

    try {
        # Change to the repository directory
        Set-Location "C:\github_repository\zoobayd-platform"

        # Configure git user
        git config --global user.name "Zoobayd Platform Bot"
        git config --global user.email "support@zoobayd.com"

        # Create a new branch
        git checkout -b $BranchName

        # Stage all changes
        git add .

        # Commit changes
        git commit -m "$CommitMessage"

        # Push to remote repository
        git push -u origin $BranchName

        Write-Host "Successfully pushed changes to $BranchName" -ForegroundColor Green

        # Optional: Create a pull request (you would typically do this on GitHub)
        Write-Host "Please create a pull request on GitHub to merge these changes" -ForegroundColor Yellow
    }
    catch {
        Write-Host "Error pushing changes: $_" -ForegroundColor Red
        throw
    }
}

# Run the push function
Push-ZoobayChanges