import React from 'react'
import WeatherDashboard from './components/WeatherDashboard'

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Weather Dashboard</h1>
      </header>
      <main>
        <WeatherDashboard />
      </main>
      <footer>
        <small>Data from Open-Meteo · No API key required</small>
      </footer>
    </div>
  )
}
