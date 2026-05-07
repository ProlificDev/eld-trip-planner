# Loom Video Walkthrough Script (3-5 minutes)

## 🎬 Video Structure

### Introduction (30 seconds)

**[Show landing page]**

"Hi! This is the ELD Trip Planner - a full-stack web application I built to help truck drivers plan HOS-compliant trips. The app automatically schedules driving time, breaks, fuel stops, and rest periods according to FMCSA regulations, then generates interactive maps and printable ELD log sheets."

**Key points to mention:**
- Solves real-world problem for truck drivers
- Full-stack: Django backend + React frontend
- Enforces 70-hour/8-day HOS cycle rules

---

### Demo: Form Input (45 seconds)

**[Fill out the form]**

"Let me show you how it works. I'll plan a trip from Chicago to Atlanta with a pickup in Indianapolis."

**Actions:**
1. Type "Chicago, IL" in Current Location
2. Type "Indianapolis, IN" in Pickup Location
3. Type "Atlanta, GA" in Dropoff Location
4. Adjust slider to 32 hours
5. Fill in optional fields (driver name, carrier, truck number)

"The app accepts city/state or coordinates. I'm setting the current cycle usage to 32 hours - meaning the driver has already used 32 of their 70 available hours this week."

**[Click Calculate Trip Plan]**

"When I submit, the backend calculates the route, applies HOS rules, and generates a complete schedule."

---

### Demo: Results - Map (45 seconds)

**[Show results page]**

"Here are the results. First, we see a trip summary - 587 miles over 2 days, ending with 45 hours used in the cycle."

**[Interact with map]**

"The interactive map shows the complete route with markers for:"
- **[Click pickup marker]** "The pickup location in Indianapolis"
- **[Click fuel marker]** "Automatic fuel stops every 1,000 miles"
- **[Click dropoff marker]** "And the final dropoff in Atlanta"

"The blue line shows the actual route. All of this uses Leaflet.js with OpenRouteService API for accurate routing."

---

### Demo: ELD Log Sheets (60 seconds)

**[Show ELD log canvas]**

"Now here's the coolest part - the ELD daily log sheets. This is rendered using HTML5 Canvas to match the standard ELD format."

**[Point to elements]**

"The log has:"
- "A 24-hour grid from midnight to midnight"
- "Four status rows: Off Duty, Sleeper Berth, Driving, and On Duty"
- "Color-coded bars showing each activity"
- "Header with driver info and date"
- "Footer with total hours for each status"

**[Switch days]**

"I can switch between days using these tabs. Day 1 shows the pickup, driving, mandatory break, and rest. Day 2 shows the overnight rest, final driving segment, and dropoff."

**[Click print button]**

"And drivers can print or download any log sheet as a PDF for their records."

---

### Demo: Detailed Schedule (30 seconds)

**[Scroll to detailed schedule]**

"Below the log, there's a detailed schedule showing every event with exact times and durations. You can see:"
- "The 1-hour pickup period"
- "Driving segments"
- "The mandatory 30-minute break after 8 hours"
- "10-hour rest periods"
- "Everything color-coded by status"

---

### Code Walkthrough (60 seconds)

**[Open code editor - show scheduler.py]**

"Let me quickly show you the code. The heart of the app is the HOS scheduler in Django."

**[Scroll through scheduler.py]**

"This TripScheduler class:"
- "Tracks driving hours, on-duty time, and cycle usage"
- "Automatically inserts mandatory breaks after 8 hours"
- "Enforces the 11-hour driving and 14-hour on-duty limits"
- "Adds 10-hour rest periods"
- "Inserts fuel stops every 1,000 miles"

**[Show constants.py briefly]**

"All the HOS rules are defined as constants here - max driving, break requirements, cycle limits."

**[Open ELDLogCanvas.jsx]**

"On the frontend, the ELD canvas component:"
- "Maps each status to a row"
- "Converts times to pixel positions"
- "Draws colored rectangles for each event"
- "Connects status changes with vertical lines"
- "Renders everything on an HTML5 canvas"

**[Show views.py]**

"The API endpoint ties it all together - geocodes locations, calculates routes, runs the scheduler, and returns the complete trip plan as JSON."

---

### Architecture & Tech Stack (30 seconds)

**[Show project structure or diagram]**

"The architecture is:"
- "**Backend:** Django with REST Framework, GeoPy for geocoding, OpenRouteService for routing"
- "**Frontend:** React with Vite, Tailwind CSS for styling, Leaflet for maps, Canvas for ELD rendering"
- "**Deployment:** Backend on Railway, frontend on Vercel"

"The app is fully responsive with dark mode support and works on mobile devices."

---

### Closing (20 seconds)

**[Show README or documentation]**

"The project includes comprehensive documentation:"
- "Setup guides for local development"
- "Deployment instructions"
- "API documentation"
- "Test scenarios"

"Everything is on GitHub with detailed README files. Thanks for watching!"

**[End screen with GitHub link]**

---

## 🎯 Key Points to Emphasize

1. **Real-world problem solving** - Helps truck drivers stay compliant
2. **Complex business logic** - HOS rules are intricate
3. **Full-stack skills** - Backend API + Frontend UI
4. **Canvas rendering** - Technical challenge of drawing ELD logs
5. **Production-ready** - Deployment configs, documentation, error handling

## 📝 Talking Tips

- **Be enthusiastic** but professional
- **Speak clearly** and at a moderate pace
- **Show, don't just tell** - interact with the UI
- **Highlight technical challenges** - HOS logic, canvas rendering
- **Mention scalability** - Could add auth, history, fleet management
- **Keep it concise** - 3-5 minutes max

## 🎥 Recording Tips

1. **Close unnecessary tabs/apps**
2. **Use a clean browser profile** (no extensions visible)
3. **Test audio** before recording
4. **Have a glass of water** nearby
5. **Do a practice run** first
6. **Smile** - it comes through in your voice!

## 📊 Screen Recording Checklist

- [ ] Browser at 1920x1080 or 1280x720
- [ ] Zoom level at 100%
- [ ] Dark mode or light mode (choose one)
- [ ] No personal info visible
- [ ] Code editor with good theme
- [ ] Terminal with clean prompt
- [ ] GitHub repo ready to show

## 🔄 Alternative Flow (If Short on Time)

**2-Minute Version:**
1. Introduction (20s)
2. Quick form demo (20s)
3. Show map and results (30s)
4. Show ELD canvas (30s)
5. Quick code overview (30s)
6. Closing (10s)

## 🎬 Post-Recording

- [ ] Review the video
- [ ] Check audio quality
- [ ] Verify all features shown
- [ ] Add video link to README
- [ ] Share on LinkedIn/portfolio

---

**Good luck with your recording! 🎥**
