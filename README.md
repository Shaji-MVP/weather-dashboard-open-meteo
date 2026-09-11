# Weather Dashboard (Open-Meteo)

React + Vite frontend with Chart.js charts and react-icons weather icons, plus an Express proxy that provides caching and rate limiting for upstream Open‑Meteo APIs.

Quick start
1. Clone the repo
   git clone https://github.com/Shaji-MVP/weather-dashboard-open-meteo.git
2. Install dependencies
   npm install
3. Start backend
   node server/index.js
4. Start frontend (in another terminal)
   npm run dev
5. Open http://localhost:5173

Notes
- The backend proxy runs on port 5174 by default and exposes /api/geocode and /api/weather. Responses are cached in-memory for 5 minutes and clients are rate-limited to 60 requests/minute per IP.
- Development: vite.config.js contains a proxy so /api requests from the dev server are forwarded to the backend.
- To run both simultaneously: npm run dev:all (requires dev dependency "concurrently").

Files of interest
- src/: React app
- server/index.js: Express proxy
- .env.example: environment flags

Extensions you might add
- Use Redis instead of in-memory cache for multi-instance deployments
- Add unit toggle (C/F) and more weather parameters
- Deploy backend to Render/Heroku and frontend to Vercel/Netlify
