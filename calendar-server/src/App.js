import React, { useState, useEffect } from 'react'
import '@fontsource/roboto'

import './App.scss'
import ClockScreen from './components/clock-screen/ClockScreen'
import defaults from './defaults.js'

const parseHourMinute = ( string ) =>
{
  const re = /(?<hour>\d{1,2})(:(?<minute>\d{2}))?\s*(?<ampm>am|pm)/i
  const match = re.exec(string)

  if( match === null ) 
  {
    return null
  } else {
    return ({
      hour: Number.parseInt(match.groups.hour) + (match.groups.ampm.toLowerCase() === "pm" ? 12 : 0),
      minute: Number.parseInt(match.groups.minute) || 0
    })
  }
}

const LATLNG = process.env.REACT_APP_LATLNG.split(',')
const GEO = {lat: Number.parseFloat(LATLNG[0].trim()), lng: Number.parseFloat(LATLNG[1].trim())}
const WEEK_START_MONDAY = process.env.REACT_APP_WEEK_START_MONDAY === "true" || process.env.REACT_APP_WEEK_START_MONDAY === "1"
const NIGHT_START = parseHourMinute(process.env.REACT_APP_NIGHT_START) || defaults.NIGHT_START

if( process.env.NODE_ENV === "development" ) console.debug({ App: { env: process.env, GEO, WEEK_START_MONDAY, NIGHT_START } })

export default function App( )
{
  const [date, setDate] = useState(new Date())
  useEffect(( ) =>
  {
    let timerId

    // updates the time on each minute increment
    const syncDate = ( ) =>
    {
      const newDate = new Date()
      setDate(newDate)

      // calc time until next minute increment
      const nextUpdateMs = (60 - newDate.getSeconds()) * 1000 - newDate.getMilliseconds()
      timerId = window.setTimeout(syncDate, nextUpdateMs)
    }

    syncDate()

    return ( ) => window.clearTimeout(timerId)
  }, [])

  return (
    <div className="App">
      <ClockScreen date={date} geo={GEO} weekStartsOnMonday={WEEK_START_MONDAY} nightStart={NIGHT_START}/>
    </div>
  )
}