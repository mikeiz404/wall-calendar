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
  if( date > sunrise && date < sunset ) return "day"
  else if( date < night && date >= sunset ) return "evening"
  else return "night"
}

const ClockScreen = ( props ) =>
{
  const times = SunCalc.getTimes(props.date, props.geo.lat, props.geo.lng)
  const night = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), props.nightStart.hour, props.nightStart.minute)
  const mode = getTimeClass(times.sunset, night, times.sunrise, props.date)
  
  const hemisphere = props.lat >= 0 ? "north" : "south"
  const seasonInfo = getAstroSeason(props.date, hemisphere)
  const seasonTertial = calcSeasonProgressTertial(seasonInfo.start, seasonInfo.end, props.date)

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