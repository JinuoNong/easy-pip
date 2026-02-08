Write-Host "Stopping Easy Pip processes..."
Get-Process | Where-Object {$_.ProcessName -like "Easy Pip"} | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "Cleaning build directory..."
if (Test-Path "dist-build-v17") { Remove-Item -Recurse -Force "dist-build-v17" }
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }

Write-Host "Building frontend..."
npm run build

Write-Host "Packaging application..."
npm run dist

Write-Host "Build complete!"