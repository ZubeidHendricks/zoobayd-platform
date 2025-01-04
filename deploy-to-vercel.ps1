# Zoobayd Platform Deployment Script

function Deploy-ZoobayPlatform {
    param(
        [switch]$Production = $false,
        [switch]$Preview = $false
    )

    try {
        # Ensure we're in the correct directory
        Set-Location "C:\github_repository\zoobayd-platform"

        # Verify Vercel CLI is installed
        if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
            Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
            npm install -g vercel
        }

        # Ensure user is logged in to Vercel
        vercel login

        # Determine deployment type
        $deploymentFlag = if ($Production) { "--prod" } elseif ($Preview) { "" } else { "" }

        # Build frontend
        Write-Host "Building frontend..." -ForegroundColor Cyan
        Set-Location ".\packages\frontend"
        npm run build

        # Return to root directory
        Set-Location "..\.."

        # Deploy to Vercel
        Write-Host "Deploying to Vercel..." -ForegroundColor Green
        vercel $deploymentFlag

        # Success message
        if ($Production) {
            Write-Host "Production deployment complete!" -ForegroundColor Green
        } else {
            Write-Host "Preview deployment complete!" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Deployment failed: $_" -ForegroundColor Red
    }
    finally {
        # Pause to keep window open
        Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
    }
}

# Run the deployment function
# Uncomment the appropriate line based on your deployment need
# Deploy-ZoobayPlatform        # Standard deployment
# Deploy-ZoobayPlatform -Preview  # Preview deployment
Deploy-ZoobayPlatform -Production  # Production deployment