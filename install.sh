#!/bin/bash

# Berlin Student Portal - Installation Script
# This script will set up the project and start the development server

echo "🎓 Berlin Student Portal - Installation Script"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check for package manager
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
    echo "📦 Using pnpm"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
    echo "📦 Using npm"
else
    echo "❌ No package manager found. Please install npm or pnpm."
    exit 1
fi

echo ""
echo "📥 Installing dependencies..."
echo ""

$PACKAGE_MANAGER install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "================================================"
    echo "🚀 Starting development server..."
    echo "================================================"
    echo ""
    echo "The app will be available at: http://localhost:3000"
    echo ""
    echo "Create a local account after configuring the backend."
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    $PACKAGE_MANAGER run dev
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi

