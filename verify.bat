@echo off
REM Project completion verification script for Windows
REM Run this to verify all components are in place

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo Dr. Davinci Database Integration - Verification Script
echo ============================================================
echo.

set "TOTAL=0"
set "FOUND=0"

REM Function to check file
:check_file
if exist "%~1" (
    echo [OK] %~2
    set /a FOUND+=1
) else (
    echo [MISSING] %~2 (%~1)
)
set /a TOTAL+=1
goto :eof

echo Backend Files:
call :check_file "server\index.ts" "Express server setup"
call :check_file "server\database.ts" "SQLite database config"
call :check_file "server\routes\auth.ts" "Authentication endpoints"
call :check_file "server\routes\history.ts" "Chat history endpoints"
call :check_file "server\utils\uuid.ts" "UUID generator"
call :check_file "server\package.json" "Backend dependencies"
call :check_file "server\tsconfig.json" "Backend TypeScript config"
call :check_file "server\.env" "Backend environment config"
call :check_file "server\.env.example" "Backend config template"

echo.
echo Frontend Services:
call :check_file "services\apiClient.ts" "HTTP API client"
call :check_file "services\authService.ts" "Auth service (updated)"
call :check_file "services\historyService.ts" "History service (updated)"

echo.
echo Frontend Configuration:
call :check_file "App.tsx" "Main app (updated)"
call :check_file "vite.config.ts" "Vite config (updated)"
call :check_file ".env" "Frontend env config"
call :check_file ".env.example" "Frontend env template"

echo.
echo Documentation Files:
call :check_file "START_HERE.md" "Roadmap for new users"
call :check_file "QUICK_START.md" "5-minute setup guide"
call :check_file "DATABASE_SETUP.md" "Complete technical docs"
call :check_file "ARCHITECTURE.md" "System architecture"
call :check_file "MIGRATION_NOTES.md" "Migration from LocalStorage"
call :check_file "IMPLEMENTATION_SUMMARY.md" "Implementation details"
call :check_file "COMPLETION_CHECKLIST.md" "Feature checklist"
call :check_file "README_DATABASE.md" "Database overview"
call :check_file "PROJECT_COMPLETE.md" "Project completion summary"

echo.
echo Installation Scripts:
call :check_file "install.sh" "macOS/Linux installer"
call :check_file "install.bat" "Windows installer"

echo.
echo Configuration Files:
call :check_file "server\.gitignore" "Server git ignore"
call :check_file ".gitignore" "Root git ignore"

echo.
echo ============================================================
echo Summary:
echo Total items: %TOTAL%
echo Found: %FOUND%

if %FOUND% equ %TOTAL% (
    echo [SUCCESS] ALL COMPONENTS PRESENT!
) else (
    set /a MISSING=%TOTAL%-%FOUND%
    echo [WARNING] Missing: !MISSING! components
)
echo.

echo System Checks:
where node >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
    echo [OK] Node.js installed: %NODE_VER%
) else (
    echo [MISSING] Node.js not found
)

where npm >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i
    echo [OK] npm installed: %NPM_VER%
) else (
    echo [MISSING] npm not found
)

if exist "node_modules" (
    echo [OK] Frontend dependencies installed
) else (
    echo [TODO] Run: npm install (frontend)
)

if exist "server\node_modules" (
    echo [OK] Backend dependencies installed
) else (
    echo [TODO] Run: cd server ^& npm install
)

if exist "server\data\app.db" (
    echo [OK] Database created
) else (
    echo [INFO] Database will auto-create on first run
)

echo.
echo ============================================================
echo Verification Complete!
echo.
echo Next Steps:
echo 1. Read: START_HERE.md
echo 2. Run: cd server ^& npm run dev (Terminal 1)
echo 3. Run: npm run dev (Terminal 2)
echo 4. Open: http://localhost:5173
echo.
echo Happy coding!
echo.
pause
