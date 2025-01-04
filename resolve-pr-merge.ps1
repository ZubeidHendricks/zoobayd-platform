# Resolve Pull Request Merge Conflicts

function Resolve-PullRequestConflicts {
    param(
        [int]$PullRequestNumber = 5
    )

    try {
        # Verbose output
        Write-Host "Starting Pull Request Merge Resolution" -ForegroundColor Cyan
        Write-Host "-----------------------------" -ForegroundColor Cyan

        # Checkout the pull request branch
        Write-Host "Checking out pull request branch..." -ForegroundColor Yellow
        gh pr checkout $PullRequestNumber

        # Fetch the latest main branch
        Write-Host "Fetching latest main branch..." -ForegroundColor Yellow
        git fetch origin main

        # Attempt to merge main into the PR branch
        Write-Host "Merging main branch..." -ForegroundColor Yellow
        git merge origin/main

        # Check if there are conflicts
        $conflicts = git diff --name-only --diff-filter=U
        if ($conflicts) {
            Write-Host "Conflicts detected in the following files:" -ForegroundColor Red
            $conflicts | ForEach-Object { Write-Host $_ }
            
            Write-Host "`nPlease resolve the conflicts manually:" -ForegroundColor Yellow
            Write-Host "1. Open the conflicting files" -ForegroundColor Yellow
            Write-Host "2. Edit the files to resolve conflicts" -ForegroundColor Yellow
            Write-Host "3. Stage the resolved files with 'git add'" -ForegroundColor Yellow
            Write-Host "4. Commit the changes with 'git commit'" -ForegroundColor Yellow

            # Pause to allow manual intervention
            Write-Host "`nPress any key to continue after resolving conflicts..." -ForegroundColor Cyan
            $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        else {
            Write-Host "No conflicts detected. Merge successful!" -ForegroundColor Green
        }

        # Stage all changes
        Write-Host "Staging all changes..." -ForegroundColor Yellow
        git add .

        # Commit changes
        Write-Host "Committing merge..." -ForegroundColor Yellow
        git commit -m "Resolve merge conflicts for pull request #$PullRequestNumber"

        # Push changes
        Write-Host "Pushing changes..." -ForegroundColor Yellow
        git push origin HEAD

        Write-Host "Pull request merge resolution complete!" -ForegroundColor Green

        # Attempt to merge the pull request
        Write-Host "Merging pull request..." -ForegroundColor Yellow
        gh pr merge $PullRequestNumber --squash

        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    catch {
        Write-Host "Pull request merge resolution failed: $_" -ForegroundColor Red
        
        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Run the merge resolution function
Resolve-PullRequestConflicts