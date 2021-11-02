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

const ClockScreen = (props) => {
  let times = SunCalc.getTimes(props.date, props.lat, props.lng)
  const mode = (props.date > times.sunrise && props.date < times.sunset) ? "day" : "night"
  
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