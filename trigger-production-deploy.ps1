# Trigger Vercel Production Deployment

function Trigger-ProductionDeploy {
    param(
        [string]$CommitMessage = "Trigger Vercel production deployment"
    )

    try {
        # Ensure we're in the correct directory
        Set-Location "C:\github_repository\zoobayd-platform"

        # Verify we're on main branch
        $currentBranch = git rev-parse --abbrev-ref HEAD
        if ($currentBranch -ne "main") {
            Write-Host "Switching to main branch..." -ForegroundColor Yellow
            git checkout main
        }

        # Pull latest changes
        Write-Host "Pulling latest changes..." -ForegroundColor Yellow
        git pull origin main

        # Stage all changes (if any)
        Write-Host "Staging changes..." -ForegroundColor Yellow
        git add .

        # Commit changes
        Write-Host "Committing changes..." -ForegroundColor Yellow
        git commit -m "$CommitMessage" --allow-empty

        # Push to main branch
        Write-Host "Pushing to main branch..." -ForegroundColor Green
        git push origin main

        # Trigger Vercel deployment (if Vercel CLI is available)
        if (Get-Command vercel -ErrorAction SilentlyContinue) {
            Write-Host "Triggering Vercel deployment..." -ForegroundColor Cyan
            vercel --prod
        }

        Write-Host "Production deployment triggered successfully!" -ForegroundColor Green

        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    catch {
        Write-Host "Deployment trigger failed: $_" -ForegroundColor Red
        
        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Run the deployment trigger function
Trigger-ProductionDeploy