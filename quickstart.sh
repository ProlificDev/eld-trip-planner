#!/bin/bash

echo "🚚 ELD Trip Planner - Quick Start Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11 or higher."
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Python and Node.js detected"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend/.env file"
    echo "⚠️  Please add your OpenRouteService API key to backend/.env (optional)"
else
    echo "✅ backend/.env already exists"
fi

# Run migrations
python manage.py migrate

echo "✅ Backend setup complete!"
echo ""

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

# Create .env file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend/.env file"
else
    echo "✅ frontend/.env already exists"
fi

echo "✅ Frontend setup complete!"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "  python manage.py runserver"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
echo "📚 For more information, see SETUP.md"
