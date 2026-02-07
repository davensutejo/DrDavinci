@echo off
REM Installation script for Dr. Davinci with Database (Windows)
REM Run this script to quickly set up both frontend and backend

echo.
echo ===================================================
echo ^> Installing Dr. Davinci with Database Backend...
echo ===================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version
echo.

REM Install frontend dependencies
echo [*] Installing frontend dependencies...
call npm install
if %errorlevel% equ 0 (
    echo [OK] Frontend dependencies installed
) else (
    echo [!] Frontend installation had issues
)
echo.

REM Install backend dependencies
echo [*] Installing backend dependencies...
cd server
call npm install
if %errorlevel% equ 0 (
    echo [OK] Backend dependencies installed
) else (
    echo [!] Backend installation had issues
)
cd ..
echo.

REM Check if .env files exist
echo [*] Checking environment files...

if not exist ".env" (
    echo [!] Frontend .env not found, creating from example...
    copy .env.example .env >nul
    echo [OK] Created .env
) else (
    echo [OK] Frontend .env exists
)

if not exist "server\.env" (
    echo [!] Backend .env not found, creating from example...
    copy server\.env.example server\.env >nul
    echo [OK] Created server\.env
) else (
    echo [OK] Backend .env exists
)
echo.

REM Summary
echo ===================================================
echo [DONE] Installation Complete!
echo ===================================================
echo.
echo Next Steps:
echo.
echo 1. Start Backend (Terminal 1):
echo    cd server
echo    npm run dev
echo.
echo 2. Start Frontend (Terminal 2):
echo    npm run dev
echo.
echo 3. Open in Browser:
echo    http://localhost:5173
echo.
echo Documentation:
echo    - QUICK_START.md - Quick 5-minute setup
echo    - DATABASE_SETUP.md - Complete technical details
echo    - MIGRATION_NOTES.md - Migration from LocalStorage
echo    - IMPLEMENTATION_SUMMARY.md - What was done
echo.
echo Happy coding!
echo.
pause
