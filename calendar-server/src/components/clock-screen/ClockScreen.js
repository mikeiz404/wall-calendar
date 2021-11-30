import React from 'react'
import { getAstroSeason, getTimeClass, getSunInfoFromGeo } from '../../dateUtils'

import DateTime from './DateTime'
import YearProgress from './YearProgress'

const calcSeasonProgressTertial = ( seasonStart, seasonEnd, now ) =>
{
  const percent = (now - seasonStart) / (seasonEnd - seasonStart)
  const tertial = Math.floor(percent * 3) + 1

  return tertial
}

const ClockScreen = ( props ) =>
{
  const {sunrise, sunset} = getSunInfoFromGeo(props.geo, props.date)
  const night = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), props.nightStart.hour, props.nightStart.minute)
  const mode = getTimeClass(sunset, night, sunrise, props.date)
  
  const hemisphere = props.geo.lat >= 0 ? "north" : "south"
  const seasonInfo = getAstroSeason(props.date, hemisphere)
  const seasonTertial = calcSeasonProgressTertial(seasonInfo.start, seasonInfo.end, props.date)

  if( process.env.NODE_ENV === "development") console.debug({ ClockScreen: { props, mode, hemisphere, seasonInfo, seasonTertial } })

  return (
    <div className={`ClockScreen ${mode.toLocaleLowerCase()} season-${seasonInfo.season} season-tertial-${seasonTertial}` }>
      <YearProgress date={props.date} weekStartsOnMonday={props.weekStartsOnMonday}/>
      <div className="focus">
          <DateTime date={props.date}/>
      </div>
    </div>
  )
};

export default ClockScreen