# GitHub Pull Request Merge Script

function Merge-PullRequest {
    param(
        [string]$PRNumber = "5",
        [string]$RepositoryOwner = "ZubeidHendricks",
        [string]$RepositoryName = "zoobayd-platform"
    )

    try {
        # Ensure GitHub CLI is installed
        if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
            Write-Host "GitHub CLI not found. Installing..." -ForegroundColor Yellow
            winget install --id GitHub.cli
        }

        # Authenticate with GitHub
        gh auth status

        # Merge the pull request
        Write-Host "Merging Pull Request #$PRNumber..." -ForegroundColor Cyan
        gh pr merge $PRNumber --merge

        Write-Host "Pull Request successfully merged!" -ForegroundColor Green
    }
    catch {
        Write-Host "Pull Request merge failed: $_" -ForegroundColor Red
    }
}

# Run the merge function
Merge-PullRequest