import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function WeatherChart({ hourly }) {
  if (!hourly) return null

  const labels = hourly.times.map((t) =>
    new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )

  const data = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: hourly.temperatures,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56,189,248,0.12)',
        yAxisID: 'y',
        tension: 0.2,
        pointRadius: 2,
      },
      {
        label: 'Precipitation (mm)',
        data: hourly.precipitation,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,0.12)',
        yAxisID: 'y1',
        tension: 0.2,
        pointRadius: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: '°C' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'mm' },
        grid: { drawOnChartArea: false },
      },
    },
    plugins: {
      legend: { position: 'top' },
    },
  }

  return <Line data={data} options={options} />
}
