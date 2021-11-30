import React, { useState, useEffect } from 'react'

import ClockScreen from './components/clock-screen/ClockScreen'
import defaults from './defaults.js'

import '@fontsource/roboto'

const DEMO_ENABLED = /\s*(true|1)/i.test(process.env.REACT_APP_DEMO_ENABLED)
const DemoController = DEMO_ENABLED ? require('./components/demo/DemoController').default : undefined

// App style is being imported below the Demo styles so that the App styles will take priority.
// This is needed since the AntD component library used by the demo component uses global styling which effects elements like body.
// Since the demo component is conditionally imported using require the App styles also need to be imported with require to be below it.
require('./App.scss')

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
      const syncDate = ( shouldUpdate ) =>
      {
        if( shouldUpdate )
        {
          const newDate = DEMO_ENABLED ? new Date(date.setMinutes(date.getMinutes() + 1)) : new Date()
          setDate(newDate)
        }

        // calc time until next minute increment
        const now = new Date()
        const nextUpdateMs = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
        timerId = window.setTimeout(( ) => syncDate(true), nextUpdateMs)
      }

      syncDate(false)

      return ( ) => window.clearTimeout(timerId)
  }, DEMO_ENABLED ? [date] : [])

  return (
    <div className="App">
      { DEMO_ENABLED && <DemoController date={date} setDate={setDate} geo={GEO} nightStart={NIGHT_START} /> }
      <ClockScreen date={date} geo={GEO} weekStartsOnMonday={WEEK_START_MONDAY} nightStart={NIGHT_START} />
    </div>
  )
}