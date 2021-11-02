import React, { useState, useEffect } from 'react'
import '@fontsource/roboto'

import './App.scss'
import ClockScreen from './components/clock-screen/ClockScreen'

const LATLNG = process.env.REACT_APP_LATLNG.split(',')
const LAT = LATLNG[0].trim()
const LNG = LATLNG[1].trim()
const WEEK_START_MONDAY = process.env.REACT_APP_WEEK_START_MONDAY === "true" || process.env.REACT_APP_WEEK_START_MONDAY === "1"

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
      <ClockScreen date={date} lat={LAT} lng={LNG} weekStartsOnMonday={WEEK_START_MONDAY}/>
    </div>
  )
}