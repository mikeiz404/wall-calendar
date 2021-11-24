import React from 'react';
import { getAstroSeason, getDateSuffix, SEASONS_NORTH, WEEKDAYS } from '../../dateUtils';
import SeasonIcon from './SeasonIcon';

const DateTime = ( props ) =>
{
  const h = props.date.getHours()
  const am = h < 12
  const hour = h === 0 ? 12 : h <= 12 ? h : h - 12
  const minute = props.date.getMinutes()

  const weekDay = WEEKDAYS[props.date.getDay()]

  return (
    <div className="DateTime">  
      <div className="Time">
        <span className="hour">{hour < 10 && <span className="padding">0</span>}{hour}</span>
        <span className="minute">{minute < 10 && <span className="padding">0</span>}{minute}</span>
      </div>
      <span className="ampm">{am ? 'am' : 'pm'}</span>
      <div className="date">
        <span className="weekDay">{weekDay}</span>&nbsp;<span>the</span>&nbsp;<span className="monthDay">{props.date.getDate()}<span className="suffix">{getDateSuffix(props.date.getDate())}</span></span>
      </div>
      <div className="season">
        {
          SEASONS_NORTH.map(( season ) =>
            <SeasonIcon
              season={season}
              key={season}
              className={["seasonIcon", season === getAstroSeason(props.date).season ? '' : 'hidden'].join(' ')}
            />
          )
        }
      </div>
    </div>
  )
}

export default DateTime