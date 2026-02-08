@echo off
echo Stopping Easy Pip processes...
taskkill /F /IM "Easy Pip.exe" 2>nul
timeout /t 2 /nobreak >nul

echo Cleaning build directory...
if exist dist-build-v17 rmdir /s /q dist-build-v17
if exist dist rmdir /s /q dist

echo Building frontend...
call npm run build

echo Packaging application...
call npm run dist

echo Build complete!
pause