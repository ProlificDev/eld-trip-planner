@echo off
echo 🚚 ELD Trip Planner - Quick Start Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11 or higher.
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

echo ✅ Python and Node.js detected
echo.

REM Backend setup
echo 📦 Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate

REM Install dependencies
pip install -r requirements.txt

REM Create .env file
if not exist .env (
    copy .env.example .env
    echo ✅ Created backend\.env file
    echo ⚠️  Please add your OpenRouteService API key to backend\.env (optional)
) else (
    echo ✅ backend\.env already exists
)

REM Run migrations
python manage.py migrate

echo ✅ Backend setup complete!
echo.

REM Frontend setup
echo 📦 Setting up frontend...
cd ..\frontend

REM Install dependencies
call npm install

REM Create .env file
if not exist .env (
    copy .env.example .env
    echo ✅ Created frontend\.env file
) else (
    echo ✅ frontend\.env already exists
)

echo ✅ Frontend setup complete!
echo.

echo 🎉 Setup complete!
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open http://localhost:5173 in your browser
echo.
echo 📚 For more information, see SETUP.md

cd ..
pause
