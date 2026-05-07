# 🚀 Deployment Guide - Render + Netlify

## Prerequisites
- ✅ Git repository initialized (Done!)
- ✅ GitHub account
- ✅ Render account (https://render.com)
- ✅ Netlify account (https://netlify.com)

---

## 📦 Step 1: Push to GitHub

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `eld-trip-planner`
3. Description: "Full-Stack ELD Trip Planner with HOS compliance"
4. Keep it **Public** (for portfolio)
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### 1.2 Push Your Code
```bash
cd eld-trip-planner
git remote add origin https://github.com/YOUR_USERNAME/eld-trip-planner.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `eld-trip-planner`
3. Configure the service:

**Basic Settings:**
- **Name:** `eld-trip-planner-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt && python manage.py migrate`
- **Start Command:** `gunicorn eld_planner.wsgi:application`

**Instance Type:**
- Select **"Free"** (for testing)

### 2.3 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.7` |
| `SECRET_KEY` | Generate a secure key (see below) |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | Leave empty for now (will add after deploy) |
| `CORS_ALLOWED_ORIGINS` | Leave empty for now (will add after deploy) |
| `OPENROUTE_API_KEY` | Your API key (optional) |

**To generate SECRET_KEY:**
```python
# Run this in Python:
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Or use this online: https://djecrety.ir/

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll get a URL like: `https://eld-trip-planner-backend.onrender.com`
4. **Copy this URL!** You'll need it for the frontend

### 2.5 Update Environment Variables
1. Go to your service → **"Environment"**
2. Update these variables:

| Key | Value |
|-----|-------|
| `ALLOWED_HOSTS` | `eld-trip-planner-backend.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | Leave empty for now (add Netlify URL after frontend deploy) |

3. Click **"Save Changes"** (service will redeploy)

### 2.6 Test Backend
Visit: `https://eld-trip-planner-backend.onrender.com/api/trip/plan/`

You should see: `{"detail":"Method \"GET\" not allowed."}`

This is correct! The API only accepts POST requests.

---

## 🎨 Step 3: Deploy Frontend to Netlify

### 3.1 Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub
3. Authorize Netlify

### 3.2 Deploy from GitHub
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select your repository: `eld-trip-planner`
4. Configure build settings:

**Build Settings:**
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`
- **Branch:** `main`

### 3.3 Add Environment Variable
Click **"Show advanced"** → **"New variable"**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://eld-trip-planner-backend.onrender.com` |

**Use your actual Render backend URL!**

### 3.4 Deploy
1. Click **"Deploy site"**
2. Wait 2-3 minutes
3. You'll get a random URL like: `https://random-name-123.netlify.app`

### 3.5 Customize Domain (Optional)
1. Go to **"Site settings"** → **"Domain management"**
2. Click **"Options"** → **"Edit site name"**
3. Change to: `eld-trip-planner` (if available)
4. Your URL becomes: `https://eld-trip-planner.netlify.app`

---

## 🔗 Step 4: Connect Frontend & Backend

### 4.1 Update Backend CORS
1. Go to Render dashboard
2. Open your backend service
3. Go to **"Environment"**
4. Update `CORS_ALLOWED_ORIGINS`:
   ```
   https://eld-trip-planner.netlify.app,https://random-name-123.netlify.app
   ```
   (Use your actual Netlify URLs - both custom and original)
5. Click **"Save Changes"**

### 4.2 Test the Connection
1. Visit your Netlify URL: `https://eld-trip-planner.netlify.app`
2. Fill in the form:
   - Current Location: `Chicago, IL`
   - Pickup Location: `Indianapolis, IN`
   - Dropoff Location: `Atlanta, GA`
   - Cycle: `32 hours`
3. Click **"Calculate Trip Plan"**
4. You should see results! 🎉

---

## ✅ Step 5: Verify Deployment

### Backend Checklist
- [ ] Backend URL is accessible
- [ ] API returns proper error for GET requests
- [ ] Environment variables are set
- [ ] CORS includes Netlify URL

### Frontend Checklist
- [ ] Frontend loads without errors
- [ ] Form submits successfully
- [ ] Map displays with route
- [ ] ELD logs render correctly
- [ ] Print button works
- [ ] Dark mode works

### Test Trip
- [ ] Submit a test trip
- [ ] Verify results page loads
- [ ] Check map markers
- [ ] Switch between days
- [ ] Print a log sheet

---

## 🐛 Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs: Dashboard → Logs
- Verify `gunicorn` is in requirements.txt
- Check `ALLOWED_HOSTS` includes Render domain

**"Bad Gateway"**
- Wait 5 minutes (Render free tier can be slow on first request)
- Check build logs for errors
- Verify Python version is 3.11.7

**"CORS Error"**
- Update `CORS_ALLOWED_ORIGINS` in Render
- Include both HTTP and HTTPS
- Include trailing slash variations

### Frontend Issues

**"Failed to calculate trip plan"**
- Check browser console (F12)
- Verify `VITE_API_URL` is correct
- Test backend URL directly
- Check CORS settings

**"Map not loading"**
- Check internet connection
- Verify Leaflet CSS is loading
- Check browser console for errors

**"Build failed"**
- Check Netlify deploy logs
- Verify `package.json` is correct
- Try: `npm install` locally first

---

## 📊 Monitoring

### Render Dashboard
- View logs: Real-time application logs
- Metrics: CPU, memory usage
- Events: Deploy history

### Netlify Dashboard
- Deploy log: Build output
- Functions: (not used in this project)
- Analytics: Visitor stats (paid feature)

---

## 💰 Cost Breakdown

### Render (Backend)
- **Free Tier:** 750 hours/month
- **Limitations:** 
  - Spins down after 15 min inactivity
  - First request after spin-down is slow (30s)
- **Upgrade:** $7/month for always-on

### Netlify (Frontend)
- **Free Tier:** 100GB bandwidth/month
- **Limitations:** None for this project
- **Upgrade:** $19/month for more features

**Total Cost: $0/month** (Free tier is perfect for portfolio projects!)

---

## 🎯 Post-Deployment Tasks

### Update README
1. Add live URLs to README.md:
   ```markdown
   ## 🌐 Live Demo
   - **Frontend:** https://eld-trip-planner.netlify.app
   - **Backend API:** https://eld-trip-planner-backend.onrender.com
   ```

2. Commit and push:
   ```bash
   git add README.md
   git commit -m "Add live demo URLs"
   git push
   ```

### Record Demo Video
1. Follow `LOOM_SCRIPT.md`
2. Record 3-5 minute walkthrough
3. Add video link to README

### Share Your Work
- [ ] Add to LinkedIn
- [ ] Share on Twitter
- [ ] Add to portfolio website
- [ ] Update resume

---

## 🔄 Updating Your Deployment

### Update Backend
```bash
# Make changes to backend code
git add backend/
git commit -m "Update backend feature"
git push
```
Render will auto-deploy!

### Update Frontend
```bash
# Make changes to frontend code
git add frontend/
git commit -m "Update frontend feature"
git push
```
Netlify will auto-deploy!

---

## 🎉 Success!

Your ELD Trip Planner is now live and accessible worldwide!

**Next Steps:**
1. ✅ Test thoroughly
2. 🎥 Record demo video
3. 💼 Add to portfolio
4. 📱 Share on social media

---

**Need Help?**
- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- Check `TROUBLESHOOTING.md` (if issues persist)
