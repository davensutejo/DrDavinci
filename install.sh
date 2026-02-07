#!/bin/bash
# Installation script for Dr. Davinci with Database
# Run this script to quickly set up both frontend and backend

echo "🚀 Installing Dr. Davinci with Database Backend..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo -e "${BLUE}✓ Node.js version:${NC}"
node --version
echo ""

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Frontend installation had issues${NC}"
fi
echo ""

# Install backend dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd server || exit
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Backend installation had issues${NC}"
fi
cd ..
echo ""

# Check if .env files exist
echo -e "${BLUE}🔧 Checking environment files...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ Frontend .env not found, creating from example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env${NC}"
else
    echo -e "${GREEN}✓ Frontend .env exists${NC}"
fi

if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚠ Backend .env not found, creating from example...${NC}"
    cp server/.env.example server/.env
    echo -e "${GREEN}✓ Created server/.env${NC}"
else
    echo -e "${GREEN}✓ Backend .env exists${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Installation Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📖 Next Steps:${NC}"
echo ""
echo "1️⃣  Start Backend (Terminal 1):"
echo -e "   ${YELLOW}cd server${NC}"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2️⃣  Start Frontend (Terminal 2):"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3️⃣  Open in Browser:"
echo -e "   ${YELLOW}http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   • QUICK_START.md - Quick 5-minute setup"
echo "   • DATABASE_SETUP.md - Complete technical details"
echo "   • MIGRATION_NOTES.md - Migration from LocalStorage"
echo "   • IMPLEMENTATION_SUMMARY.md - What was done"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
