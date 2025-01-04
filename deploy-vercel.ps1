# Vercel Deployment Script

function Deploy-Vercel {
    try {
        # Ensure we're in the correct directory
        Set-Location "C:\github_repository\zoobayd-platform"

        # Verify Vercel project is linked
        Write-Host "Checking Vercel project link..." -ForegroundColor Yellow
        vercel link

        # Trigger production deployment
        Write-Host "Triggering Vercel production deployment..." -ForegroundColor Cyan
        vercel --prod

        # Verify deployment
        Write-Host "Deployment triggered. Checking deployment status..." -ForegroundColor Green
        vercel ls

        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    catch {
        Write-Host "Deployment failed: $_" -ForegroundColor Red
        
        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Run the deployment function
Deploy-Vercel