const express = require('express')
const NodeCache = require('node-cache')
const rateLimit = require('express-rate-limit')
const cors = require('cors')

const app = express()
const cache = new NodeCache({ stdTTL: 300 }) // cache 5 minutes by default

app.use(cors())
app.set('trust proxy', 1)

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', limiter)

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_BASE = 'https://api.open-meteo.com/v1/forecast'

app.get('/api/geocode', async (req, res) => {
  try {
    const name = req.query.name
    const count = req.query.count || '6'
    if (!name) return res.status(400).json({ error: 'missing name' })

    const key = `geocode:${name}:${count}`
    const cached = cache.get(key)
    if (cached) return res.json(cached)

    const url = `${GEOCODING_BASE}?name=${encodeURIComponent(name)}&count=${count}&language=en&format=json`
    const r = await fetch(url)
    if (!r.ok) return res.status(502).json({ error: 'geocoding upstream error' })
    const data = await r.json()
    cache.set(key, data, 300)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

app.get('/api/weather', async (req, res) => {
  try {
    const { latitude, longitude } = req.query
    if (!latitude || !longitude) return res.status(400).json({ error: 'missing lat/lon' })

    const hourly = req.query.hourly || 'temperature_2m,precipitation'
    const timezone = req.query.timezone || 'auto'
    const key = `weather:${latitude}:${longitude}:${hourly}:${timezone}`

    const cached = cache.get(key)
    if (cached) return res.json(cached)

    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current_weather: 'true',
      hourly,
      timezone,
      past_days: '0',
    })
    const url = `${WEATHER_BASE}?${params.toString()}`
    const r = await fetch(url)
    if (!r.ok) return res.status(502).json({ error: 'weather upstream error' })
    const data = await r.json()
    cache.set(key, data, 300) // cache 5 minutes
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

const PORT = process.env.PORT || 5174
app.listen(PORT, () => {
  console.log(`Weather proxy listening on http://localhost:${PORT}`)
})
