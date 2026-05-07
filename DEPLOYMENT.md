# Deployment Guide

## Backend Deployment Options

### Option 1: Railway (Recommended)

1. **Create Railway account:** https://railway.app/
2. **Create new project** from GitHub repo
3. **Select backend directory** as root
4. **Add environment variables:**
   ```
   OPENROUTE_API_KEY=your_key
   SECRET_KEY=generate_secure_key
   DEBUG=False
   ALLOWED_HOSTS=*.railway.app
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
5. Railway will auto-detect Django and deploy

### Option 2: Render

1. **Create Render account:** https://render.com/
2. **New Web Service** from GitHub
3. **Settings:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn eld_planner.wsgi:application`
   - Root Directory: `backend`
4. **Add environment variables** (same as Railway)

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Login:** `heroku login`
3. **Create app:** `heroku create your-app-name`
4. **Add buildpack:** `heroku buildpacks:set heroku/python`
5. **Set env vars:** `heroku config:set KEY=value`
6. **Deploy:** `git push heroku main`

## Frontend Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:** `npm i -g vercel`
2. **Navigate to frontend:** `cd frontend`
3. **Deploy:** `vercel`
4. **Add environment variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.railway.app`
5. **Production deploy:** `vercel --prod`

### Alternative: Netlify

1. **Install Netlify CLI:** `npm i -g netlify-cli`
2. **Build:** `npm run build`
3. **Deploy:** `netlify deploy --prod --dir=dist`
4. **Set env var** in Netlify dashboard

## Post-Deployment Checklist

- [ ] Backend is accessible at `/api/trip/plan/`
- [ ] Frontend loads without errors
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] API calls work from frontend to backend
- [ ] Map displays correctly
- [ ] ELD logs render properly
- [ ] Print functionality works

## Environment Variables Reference

### Backend
```
OPENROUTE_API_KEY=optional_but_recommended
SECRET_KEY=generate_with_django_secret_key_generator
DEBUG=False
ALLOWED_HOSTS=your-domain.com,*.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend
```
VITE_API_URL=https://your-backend.railway.app
```

## Monitoring

### Backend Health Check
```bash
curl https://your-backend.railway.app/api/trip/plan/
```

Should return 405 Method Not Allowed (POST required)

### Frontend Health Check
Open browser to your Vercel URL - should load the form

## Troubleshooting

### CORS Errors
- Update `CORS_ALLOWED_ORIGINS` in backend
- Include both with and without trailing slash
- Redeploy backend after changes

### 502 Bad Gateway
- Check backend logs
- Verify gunicorn is running
- Check Railway/Render service status

### Map Not Loading
- Check browser console
- Verify internet connection
- Check Leaflet CDN availability

### API Timeout
- Increase timeout in Railway/Render settings
- Check OpenRouteService API limits
- Consider caching route calculations
