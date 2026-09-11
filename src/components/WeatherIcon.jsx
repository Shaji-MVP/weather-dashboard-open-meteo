import React from 'react'
import {
  WiDaySunny,
  WiCloud,
  WiDayCloudy,
  WiDayRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from 'react-icons/wi'

export default function WeatherIcon({ code, size = 48 }) {
  if (code === 0) return <WiDaySunny size={size} />
  if (code === 1 || code === 2) return <WiDayCloudy size={size} />
  if (code === 3) return <WiCloud size={size} />
  if (code >= 45 && code <= 48) return <WiFog size={size} />
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <WiDayRain size={size} />
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <WiSnow size={size} />
  if (code >= 95 && code <= 99) return <WiThunderstorm size={size} />
  return <WiCloud size={size} />
}
