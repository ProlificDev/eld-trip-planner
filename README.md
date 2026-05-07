# 🚚 ELD Trip Planner

A Full-Stack ELD (Electronic Logging Device) Trip Planner web application that helps truck drivers plan HOS-compliant trips with automatic scheduling, interactive maps, and printable daily log sheets.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![Django](https://img.shields.io/badge/django-5.0-green.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)

## ✨ Features

### Core Functionality
- 🎯 **HOS-Compliant Scheduling** - Automatic enforcement of FMCSA 70-hour/8-day cycle rules
- 🗺️ **Interactive Route Map** - Visual display with Leaflet.js showing all stops and waypoints
- 📊 **ELD Daily Log Sheets** - Canvas-rendered, printable logs with standard 24-hour grid
- ⛽ **Smart Fuel Planning** - Automatic fuel stops every 1,000 miles
- 💤 **Intelligent Rest Scheduling** - Mandatory breaks and rest periods automatically inserted
- 🌓 **Dark Mode** - Full dark/light theme support
- 📱 **Mobile Responsive** - Works seamlessly on all devices

### HOS Rules Enforced
- ✅ Max 11 hours driving per day
- ✅ Max 14 hours on-duty window per day
- ✅ Mandatory 30-min break after 8 hours continuous driving
- ✅ 10-hour off-duty rest between shifts
- ✅ 70-hour cycle limit in 8 days
- ✅ Automatic fuel stops every 1,000 miles (30 min each)
- ✅ 1 hour for pickup + 1 hour for dropoff

## 🌐 Live Demo

**Try it now:** https://eldtrip-plannner.netlify.app

- **Frontend:** https://eldtrip-plannner.netlify.app
- **Backend API:** https://eld-trip-planner-4t30.onrender.com
- **GitHub Repository:** https://github.com/cyperpro20/eld-trip-planner

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
quickstart.bat
```

**Mac/Linux:**
```bash
chmod +x quickstart.sh
./quickstart.sh
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Then open http://localhost:5173 in your browser.

## 🏗️ Tech Stack

### Backend
- **Django 5.0** - Web framework
- **Django REST Framework** - API
- **GeoPy** - Geocoding
- **OpenRouteService** - Routing (optional, has fallback)

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Leaflet.js** - Interactive maps
- **HTML5 Canvas** - ELD log rendering
- **Axios** - HTTP client

### Deployment
- **Vercel** - Frontend hosting
- **Railway/Render** - Backend hosting

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guides for Railway, Render, Vercel
- **[API.md](API.md)** - Complete API documentation
- **[TESTING.md](TESTING.md)** - Test scenarios and examples
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Comprehensive project overview
- **[CHECKLIST.md](CHECKLIST.md)** - Feature completion checklist

## 🎯 Usage Example

1. **Enter Trip Details:**
   - Current Location: `Chicago, IL`
   - Pickup Location: `Indianapolis, IN`
   - Dropoff Location: `Atlanta, GA`
   - Current Cycle Used: `32 hours`

2. **Get Results:**
   - Total distance and days
   - Interactive route map
   - Daily ELD log sheets
   - Detailed schedule breakdown

3. **Print/Download:**
   - Click print button on any log sheet
   - Save as PDF or print directly

## 🧪 Testing

Run the test scenarios from [TESTING.md](TESTING.md):

```bash
# Test API endpoint
curl -X POST http://localhost:8000/api/trip/plan/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_location": "Chicago, IL",
    "pickup_location": "Indianapolis, IN",
    "dropoff_location": "Atlanta, GA",
    "current_cycle_used": 32
  }'
```

## 📁 Project Structure

```
eld-trip-planner/
├── backend/
│   ├── eld_planner/          # Django project settings
│   ├── trip_planner/         # Main app
│   │   ├── scheduler.py      # ⭐ HOS scheduling engine
│   │   ├── routing.py        # Route calculation
│   │   ├── views.py          # API endpoints
│   │   └── constants.py      # HOS rules
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TripForm.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── RouteMap.jsx
│   │   │   └── ELDLogCanvas.jsx  # ⭐ Canvas renderer
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Backend (Railway)
```bash
cd backend
railway login
railway init
railway up
```

### Frontend (Vercel)
```bash
cd frontend
vercel
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔑 Environment Variables

### Backend (.env)
```env
OPENROUTE_API_KEY=your_key_here  # Optional
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.railway.app
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.railway.app
```

## 🎥 Demo

[Add your Loom video link here]

## 🤝 Contributing

This is a portfolio/demo project. For production use, consider:
- User authentication
- Trip history database
- PDF export functionality
- Real-time GPS tracking
- Weather integration

## 📄 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

- FMCSA for HOS regulations
- OpenRouteService for routing API
- Leaflet.js for mapping capabilities
- Django and React communities

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review [TESTING.md](TESTING.md) for common scenarios
3. Check browser console for errors
4. Verify environment variables are set correctly

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web development
- RESTful API design
- Complex business logic implementation
- Canvas rendering techniques
- Map integration
- Responsive design
- Deployment workflows

---

**Built with ❤️ for truck drivers everywhere**

[⭐ Star this repo](https://github.com/yourusername/eld-trip-planner) | [🐛 Report Bug](https://github.com/yourusername/eld-trip-planner/issues) | [💡 Request Feature](https://github.com/yourusername/eld-trip-planner/issues)
