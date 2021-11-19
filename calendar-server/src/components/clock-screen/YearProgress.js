import React, { useEffect, useRef, useState } from 'react';
import { getDaysInMonth, getWeekOfYear, MONTHS } from '../../dateUtils';
import { ReactComponent as ArrowLeft } from './images/arrow-left.svg'

const QUARTERS_IN_YEAR = 4;
const MONTHS_IN_QUARTER = 3;

const getMonthTemporalVal = ( currentMonthIndex, monthIndex ) => Math.max(-1, Math.min(1, monthIndex - currentMonthIndex))
const getMarkerPositionStyle = ( monthTop, monthHeight, markerHeight, percent ) => ({ top: `${monthTop - (markerHeight / 2) + (monthHeight * (1 - percent))}px` })

const YearProgress = ( props ) =>
{
  const [currentMonthHeight, setCurrentMonthHeight] = useState(0)
  const [currentMonthTop, setCurrentMonthTop] = useState(0)
  const [monthProgressHeight, setMonthProgressHeight] = useState(0)

  const currentMonthRef = useRef()
  const monthProgressRef = useRef()

  const currentMonthProgress = (props.date.getDate() / getDaysInMonth(props.date.getYear(), props.date.getMonth()))

  const measureCurrentMonthEl = ( el ) =>
  {
    if( el )
    {
      setCurrentMonthHeight(el.offsetHeight)
      setCurrentMonthTop(el.offsetTop)
    }
  }

  const measureMonthProgressEl = ( el ) =>
  {
    if( el ) setMonthProgressHeight(el.offsetHeight)
  }

  // measure refs
  // note: measurement is done with useEffect since when component did mount is called after first render all refs will have been set
  useEffect(( ) =>
  {
    measureCurrentMonthEl(currentMonthRef.current)
    measureMonthProgressEl(monthProgressRef.current)
  }, [props.date])

  // remeasure refs on window resize
  // todo: Calculate the offset from the top in terms of relative and absolute units, and set the month progress
  // to a fixed width to avoid the need to force an update on window resize. Arguably this is a bit more brittle
  // to style changes though.
  useEffect(( ) => 
  {
    const onResize = ( ) =>
    {
      measureCurrentMonthEl(currentMonthRef.current)
      measureMonthProgressEl(monthProgressRef.current)
    }

    window.addEventListener('resize', onResize)

    return ( ) => window.removeEventListener('resize', onResize)
  }, [])

  
  return (
    <div className="YearProgress">
      <div className="monthsCol">
        {
          Array.from({length: QUARTERS_IN_YEAR})
          .map(( _, quarterIndex ) =>
            <div className="quarter" key={quarterIndex}>
              {
                Array.from({length: MONTHS_IN_QUARTER})
                .map(( _, subMonthIndex ) =>
                {
                  const monthIndex = quarterIndex * MONTHS_IN_QUARTER + subMonthIndex
                  const month = MONTHS[monthIndex]
                  const temporalVal = getMonthTemporalVal(props.date.getMonth(), monthIndex)
                  const temporalClasss = { "-1": "past", "0": "present", "1": "future" }[temporalVal]

                  return (
                    <div
                      className={["month", temporalClasss].join(' ')}
                      ref={temporalVal === 0 ? currentMonthRef : undefined}
                      key={monthIndex}
                    >
                      {month}
                    </div>
                  )
                })
              }
              </div>
          )
        }
      </div>
      <div className="monthProgressCol">
        <div className="monthProgress"
          ref={monthProgressRef}
          style={getMarkerPositionStyle(currentMonthTop, currentMonthHeight, monthProgressHeight, currentMonthProgress)}
        >
          <div className="marker">
            <ArrowLeft className="markerIcon"/>
          </div>
          <div className="label">
            <span className="unit">w</span>
            <span className="value">{getWeekOfYear(props.date, props.weekStartsOnMonday)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YearProgress