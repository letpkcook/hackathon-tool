#!/bin/bash

# Hackathon Tool - Quick Setup Script
# This script helps you set up the development environment

set -e

echo "🚀 Hackathon Tool - Quick Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.x"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL command 'psql' not found."
    echo "   Please ensure PostgreSQL is installed and in your PATH."
    echo "   You can still continue if you have PostgreSQL running."
fi

echo ""
echo "📦 Step 1: Installing dependencies..."
npm install
npm install --workspace=client
npm install --workspace=server

echo ""
echo "⚙️  Step 2: Setting up environment files..."

# Server .env
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "✅ Created server/.env (please edit with your database credentials)"
else
    echo "✅ server/.env already exists"
fi

# Client .env.local
if [ ! -f client/.env.local ]; then
    cp client/.env.example client/.env.local
    echo "✅ Created client/.env.local"
else
    echo "✅ client/.env.local already exists"
fi

echo ""
echo "🗄️  Step 3: Database setup"
echo "   Please ensure PostgreSQL is running and you have created a database."
echo "   Default database name: hackathon_tool"
echo ""
read -p "   Have you created the database? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   Running migrations..."
    cd server
    npm run migrate
    cd ..
    echo "✅ Database migrations completed"
else
    echo "   Skipping migrations. Run 'cd server && npm run migrate' when ready."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Edit server/.env with your database credentials"
echo "   2. Run 'npm run dev' to start both client and server"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
