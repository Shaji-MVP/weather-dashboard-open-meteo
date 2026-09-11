const USE_PROXY = import.meta.env.VITE_USE_PROXY === 'true'
const PROXY_URL = import.meta.env.VITE_PROXY_URL || ''

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_BASE = 'https://api.open-meteo.com/v1/forecast'

export async function geocodeCity(name, count = 6) {
  const url = USE_PROXY
    ? (PROXY_URL ? `${PROXY_URL}/api/geocode?name=${encodeURIComponent(name)}&count=${count}` : `/api/geocode?name=${encodeURIComponent(name)}&count=${count}`)
    : `${GEOCODING_BASE}?name=${encodeURIComponent(name)}&count=${count}&language=en&format=json`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Geocoding failed')
  const data = await res.json()
  return data.results || []
}

export async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current_weather: 'true',
    hourly: 'temperature_2m,precipitation',
    timezone: 'auto',
    past_days: '0',
  })
  const url = USE_PROXY
    ? (PROXY_URL ? `${PROXY_URL}/api/weather?${params.toString()}` : `/api/weather?${params.toString()}`)
    : `${WEATHER_BASE}?${params.toString()}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  const data = await res.json()
  const hourlyTimes = data.hourly.time.slice(0, 24)
  const temps = data.hourly.temperature_2m.slice(0, 24)
  const precip = data.hourly.precipitation.slice(0, 24)
  return {
    current: data.current_weather,
    hourly: {
      times: hourlyTimes,
      temperatures: temps,
      precipitation: precip,
    },
  }
}
