# ELD Trip Planner - Setup Guide

## Quick Start (Local Development)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenRouteService API key (optional - app works without it):
   ```
   OPENROUTE_API_KEY=your_key_here
   SECRET_KEY=your-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

6. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

7. **Start development server:**
   ```bash
   python manage.py runserver
   ```

Backend will be running at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
   Content should be:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

Frontend will be running at `http://localhost:5173`

## Getting OpenRouteService API Key (Optional)

The app works without an API key using fallback distance calculations, but for accurate routing:

1. Go to https://openrouteservice.org/
2. Sign up for a free account
3. Generate an API key
4. Add it to `backend/.env`

## Deployment

### Backend Deployment (Railway)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize project:**
   ```bash
   cd backend
   railway init
   ```

4. **Add environment variables in Railway dashboard:**
   - `OPENROUTE_API_KEY`
   - `SECRET_KEY` (generate a secure one)
   - `DEBUG=False`
   - `ALLOWED_HOSTS=your-railway-domain.railway.app`
   - `CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app`

5. **Deploy:**
   ```bash
   railway up
   ```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add environment variable in Vercel dashboard:**
   - `VITE_API_URL=https://your-railway-backend.railway.app`

5. **Redeploy with production settings:**
   ```bash
   vercel --prod
   ```

## Testing the Application

1. Open the frontend URL in your browser
2. Fill in the trip form:
   - Current Location: `Chicago, IL`
   - Pickup Location: `Indianapolis, IN`
   - Dropoff Location: `Atlanta, GA`
   - Current Cycle Used: 32 hours
3. Click "Calculate Trip Plan"
4. View the results:
   - Interactive route map
   - Trip summary
   - ELD daily log sheets
   - Detailed schedule

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
python manage.py runserver 8001
```

**CORS errors:**
- Check `CORS_ALLOWED_ORIGINS` in `backend/.env`
- Ensure frontend URL is included

**Geocoding errors:**
- Check internet connection
- Try using coordinates instead: `41.8781,-87.6298`

### Frontend Issues

**API connection failed:**
- Verify backend is running
- Check `VITE_API_URL` in `frontend/.env`
- Check browser console for CORS errors

**Map not displaying:**
- Check browser console for Leaflet errors
- Ensure internet connection for map tiles

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
eld-trip-planner/
├── backend/
│   ├── eld_planner/          # Django project settings
│   ├── trip_planner/         # Main app
│   │   ├── scheduler.py      # HOS scheduling logic
│   │   ├── routing.py        # Route calculation
│   │   ├── views.py          # API endpoints
│   │   └── constants.py      # HOS rules
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TripForm.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── RouteMap.jsx
│   │   │   └── ELDLogCanvas.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Features Implemented

✅ HOS-compliant trip scheduling (70-hour/8-day cycle)
✅ Automatic break insertion (30-min after 8 hours)
✅ Automatic rest periods (10 hours off-duty)
✅ Fuel stops every 1,000 miles
✅ Interactive route map with markers
✅ ELD daily log sheets (canvas-rendered)
✅ Print/download log sheets
✅ Dark mode support
✅ Mobile responsive design
✅ Real-time route calculation

## Next Steps

- Add user authentication
- Save trip history
- Export logs as PDF
- Add more HOS rule variations
- Support for team drivers
- Weather integration
- Traffic data integration
