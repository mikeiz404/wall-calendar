import React from 'react'
import SunCalc from 'suncalc'
import { getAstroSeason } from '../../dateUtils'

import DateTime from './DateTime'
import YearProgress from './YearProgress'

const calcSeasonProgressTertial = ( seasonStart, seasonEnd, now ) =>
{
  const percent = (now - seasonStart) / (seasonEnd - seasonStart)
  const tertial = Math.floor(percent * 3) + 1

  return tertial
}

const getTimeClass = ( sunset, night, sunrise, date ) =>
{
  // note: it is assumed that night starts sometime between sunset and sunrise
  // note: it is assumed sunset and sunrise are for the current day
  if( date >= sunrise && date <= sunset ) return "day"
  else if(
    ( night > sunset && date < sunrise ) ||
    (
      (
        ( night < sunrise && date < sunrise ) ||
        ( night >= sunrise && date >= sunrise )
      )
      && date >= night
    )
  ) return "night"
  else return "evening"
}

const ClockScreen = ( props ) =>
{
  // note: Using a date fixed at 12pm for SunCalc as a hack to work around SunCalc switching over the sunrise and sunset dates at 12:10am instead of 12:00am
  const {sunset, sunrise} = SunCalc.getTimes(new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), 12), props.geo.lat, props.geo.lng)
  const night = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), props.nightStart.hour, props.nightStart.minute)
  const mode = getTimeClass(sunset, night, sunrise, props.date)
  
  const hemisphere = props.geo.lat >= 0 ? "north" : "south"
  const seasonInfo = getAstroSeason(props.date, hemisphere)
  const seasonTertial = calcSeasonProgressTertial(seasonInfo.start, seasonInfo.end, props.date)

  if( process.env.NODE_ENV === "development") console.debug({ ClockScreen: { props, sunset, sunrise, night, mode, hemisphere, seasonInfo, seasonTertial } })

  return (
    <div className={`ClockScreen ${mode} season-${seasonInfo.season} season-tertial-${seasonTertial}` }>
      <YearProgress date={props.date} weekStartsOnMonday={props.weekStartsOnMonday}/>
      <div className="focus">
          <DateTime date={props.date}/>
      </div>
    </div>
  )
};

export default ClockScreen