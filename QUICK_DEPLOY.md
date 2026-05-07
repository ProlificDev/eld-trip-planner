# ⚡ Quick Deploy Reference

## 🎯 Your Deployment Stack
- **Backend:** Render.com
- **Frontend:** Netlify
- **Repository:** GitHub

---

## 📋 Quick Steps

### 1️⃣ Push to GitHub (5 min)
```bash
# Create repo on GitHub first, then:
cd eld-trip-planner
git remote add origin https://github.com/YOUR_USERNAME/eld-trip-planner.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy Backend on Render (10 min)
1. Go to https://render.com → New Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt && python manage.py migrate`
   - Start: `gunicorn eld_planner.wsgi:application`
4. Environment Variables:
   - `SECRET_KEY`: Generate at https://djecrety.ir/
   - `DEBUG`: `False`
   - `PYTHON_VERSION`: `3.11.7`
5. Deploy & copy URL

### 3️⃣ Deploy Frontend on Netlify (5 min)
1. Go to https://netlify.com → New site from Git
2. Connect GitHub repo
3. Settings:
   - Base directory: `frontend`
   - Build: `npm run build`
   - Publish: `frontend/dist`
4. Environment Variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com`
5. Deploy & copy URL

### 4️⃣ Connect Them (2 min)
1. Go back to Render
2. Add environment variable:
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.netlify.app`
3. Save (auto-redeploys)

### 5️⃣ Test (2 min)
Visit your Netlify URL and submit a test trip!

---

## 🔑 Environment Variables Cheat Sheet

### Render (Backend)
```
SECRET_KEY=your-generated-secret-key
DEBUG=False
PYTHON_VERSION=3.11.7
ALLOWED_HOSTS=your-app.onrender.com
CORS_ALLOWED_ORIGINS=https://your-app.netlify.app
OPENROUTE_API_KEY=optional
```

### Netlify (Frontend)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## ✅ Success Checklist
- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Netlify
- [ ] CORS configured
- [ ] Test trip successful
- [ ] URLs added to README
- [ ] Demo video recorded

---

## 🆘 Quick Fixes

**CORS Error?**
→ Update `CORS_ALLOWED_ORIGINS` on Render

**Backend slow?**
→ Normal on free tier (first request takes 30s)

**Build failed?**
→ Check deploy logs on Render/Netlify

**Map not loading?**
→ Check browser console (F12)

---

## 📱 Your Live URLs

After deployment, update these:

- **Frontend:** https://_____.netlify.app
- **Backend:** https://_____.onrender.com
- **GitHub:** https://github.com/_____/eld-trip-planner

---

**Full guide:** See `DEPLOY_GUIDE.md`
