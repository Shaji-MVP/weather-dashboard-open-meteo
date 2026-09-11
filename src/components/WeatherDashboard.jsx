import React, { useState } from 'react'
import { geocodeCity, fetchWeather } from '../api/weather'
import WeatherChart from './WeatherChart'
import WeatherIcon from './WeatherIcon'

function formatTemp(t) {
  return `${Math.round(t)}°C`
}

function weatherCodeToText(code) {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Cloudy'
  if (code <= 48) return 'Fog'
  if (code <= 67) return 'Drizzle / Freezing'
  if (code <= 77) return 'Snow'
  if (code <= 86) return 'Snow showers'
  if (code <= 99) return 'Thunderstorm'
  return 'Weather'
}

export default function WeatherDashboard() {
  const [query, setQuery] = useState('')
  const [places, setPlaces] = useState([])
  const [loadingPlaces, setLoadingPlaces] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loadingWeather, setLoadingWeather] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setError(null)
    setLoadingPlaces(true)
    setPlaces([])
    try {
      const p = await geocodeCity(query.trim())
      if (!p || p.length === 0) setError('No places found')
      setPlaces(p)
    } catch (err) {
      setError('Failed to search places')
    } finally {
      setLoadingPlaces(false)
    }
  }

  async function selectPlace(place) {
    setSelected(place)
    setWeather(null)
    setLoadingWeather(true)
    setError(null)
    try {
      const w = await fetchWeather(place.latitude, place.longitude)
      setWeather(w)
    } catch (err) {
      setError('Failed to fetch weather')
    } finally {
      setLoadingWeather(false)
    }
  }

  return (
    <div className="dashboard">
      <form onSubmit={handleSearch} className="search">
        <input
          aria-label="Search city"
          placeholder="Search city (e.g., London)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loadingPlaces && <p>Searching places…</p>}
      {error && <p className="error">{error}</p>}

      {places.length > 0 && (
        <div className="places">
          <h3>Pick a place</h3>
          <ul>
            {places.map((p) => (
              <li key={`${p.name}-${p.latitude}-${p.longitude}`}>
                <button onClick={() => selectPlace(p)}>
                  {p.name}{p.admin1 ? `, ${p.admin1}` : ''}{p.country ? ` — ${p.country}` : ''}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected && (
        <div className="selected">
          <h2>
            {selected.name}{selected.admin1 ? `, ${selected.admin1}` : ''}{selected.country ? ` — ${selected.country}` : ''}
          </h2>
          <p className="coords">
            {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}
            {selected.population ? ` · pop ${selected.population}` : ''}
          </p>
        </div>
      )}

      {loadingWeather && <p>Loading weather…</p>}

      {weather && (
        <section className="weather">
          <div className="current">
            <h3>Now</h3>
            <div className="now-row">
              <div className="temp">{formatTemp(weather.current.temperature)}</div>
              <div className="desc">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <WeatherIcon code={weather.current.weathercode} size={48} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{weatherCodeToText(weather.current.weathercode)}</div>
                    <div style={{ color: 'var(--muted)' }}>{weather.current.wind_speed} m/s wind</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hourly">
            <h3>Hourly (next 24h)</h3>
            <WeatherChart hourly={weather.hourly} />
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Temp</th>
                  <th>Precip (mm)</th>
                </tr>
              </thead>
              <tbody>
                {weather.hourly.times.map((t, i) => (
                  <tr key={t}>
                    <td>{new Date(t).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</td>
                    <td>{formatTemp(weather.hourly.temperatures[i])}</td>
                    <td>{weather.hourly.precipitation[i] != null ? weather.hourly.precipitation[i].toFixed(2) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
