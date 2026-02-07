#!/bin/bash
# Project completion verification script
# Run this to verify all components are in place

echo ""
echo "🔍 Dr. Davinci Database Integration - Verification Script"
echo "=========================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counter
TOTAL=0
FOUND=0

# Function to check file
check_file() {
    local file=$1
    local desc=$2
    ((TOTAL++))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $desc"
        ((FOUND++))
    else
        echo -e "${RED}✗${NC} $desc (NOT FOUND: $file)"
    fi
}

# Function to check directory
check_dir() {
    local dir=$1
    local desc=$2
    ((TOTAL++))
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $desc"
        ((FOUND++))
    else
        echo -e "${RED}✗${NC} $desc (NOT FOUND: $dir)"
    fi
}

echo -e "${BLUE}Backend Files:${NC}"
check_file "server/index.ts" "Express server setup"
check_file "server/database.ts" "SQLite database config"
check_file "server/routes/auth.ts" "Authentication endpoints"
check_file "server/routes/history.ts" "Chat history endpoints"
check_file "server/utils/uuid.ts" "UUID generator"
check_file "server/package.json" "Backend dependencies"
check_file "server/tsconfig.json" "Backend TypeScript config"
check_file "server/.env" "Backend environment config"
check_file "server/.env.example" "Backend config template"
check_dir "server/routes" "Routes directory"
check_dir "server/utils" "Utils directory"

echo ""
echo -e "${BLUE}Frontend Services:${NC}"
check_file "services/apiClient.ts" "HTTP API client"
check_file "services/authService.ts" "Auth service (updated)"
check_file "services/historyService.ts" "History service (updated)"

echo ""
echo -e "${BLUE}Frontend Configuration:${NC}"
check_file "App.tsx" "Main app (updated)"
check_file "vite.config.ts" "Vite config (updated)"
check_file ".env" "Frontend env config"
check_file ".env.example" "Frontend env template"

echo ""
echo -e "${BLUE}Documentation Files:${NC}"
check_file "START_HERE.md" "Roadmap for new users"
check_file "QUICK_START.md" "5-minute setup guide"
check_file "DATABASE_SETUP.md" "Complete technical docs"
check_file "ARCHITECTURE.md" "System architecture"
check_file "MIGRATION_NOTES.md" "Migration from LocalStorage"
check_file "IMPLEMENTATION_SUMMARY.md" "Implementation details"
check_file "COMPLETION_CHECKLIST.md" "Feature checklist"
check_file "README_DATABASE.md" "Database overview"
check_file "PROJECT_COMPLETE.md" "Project completion summary"

echo ""
echo -e "${BLUE}Installation Scripts:${NC}"
check_file "install.sh" "macOS/Linux installer"
check_file "install.bat" "Windows installer"

echo ""
echo -e "${BLUE}Configuration Files:${NC}"
check_file "server/.gitignore" "Server git ignore"
check_file ".gitignore" "Root git ignore"
check_file "server/package-lock.json" "Backend dependencies lock"

echo ""
echo "=========================================================="
echo -e "${BLUE}Summary:${NC}"
echo -e "Total items: $TOTAL"
echo -e "Found: ${GREEN}$FOUND${NC}"
if [ $FOUND -eq $TOTAL ]; then
    echo -e "${GREEN}✓ ALL COMPONENTS PRESENT!${NC}"
else
    echo -e "${YELLOW}⚠ Missing: $((TOTAL - FOUND)) components${NC}"
fi
echo ""

# Additional checks
echo -e "${BLUE}System Checks:${NC}"

if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} Node.js installed: $(node --version)"
else
    echo -e "${RED}✗${NC} Node.js not found"
fi

if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓${NC} npm installed: $(npm --version)"
else
    echo -e "${RED}✗${NC} npm not found"
fi

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Run: npm install (frontend)"
fi

if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Run: cd server && npm install"
fi

if [ -f "server/data/app.db" ]; then
    echo -e "${GREEN}✓${NC} Database created"
else
    echo -e "${YELLOW}⚠${NC} Database will auto-create on first run"
fi

echo ""
echo "=========================================================="
echo -e "${GREEN}🎉 Verification Complete!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Read: START_HERE.md"
echo "2. Run: cd server && npm run dev (Terminal 1)"
echo "3. Run: npm run dev (Terminal 2)"
echo "4. Open: http://localhost:5173"
echo ""
echo "Happy coding! 🚀"
echo ""
