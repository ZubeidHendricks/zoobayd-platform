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

        # Add MongoDB URI secret to Vercel
        Write-Host "Setting up Vercel MongoDB URI secret..." -ForegroundColor Cyan
        vercel secrets add zoobayd_mongodb_uri "mongodb+srv://zubeidhendricks:Zaza786*@cluster0.vzgtq.mongodb.net/zoobayd?retryWrites=true&w=majority&appName=Cluster0"

        # Trigger Vercel deployment
        Write-Host "Triggering Vercel deployment..." -ForegroundColor Green
        vercel --prod --env MONGODB_URI=@zoobayd_mongodb_uri

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