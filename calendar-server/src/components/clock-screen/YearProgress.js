import React, { useEffect, useRef, useReducer } from 'react';
import { getDaysInMonth, getWeekOfYear, MONTHS } from '../../dateUtils';
import { ReactComponent as ArrowLeft } from './images/arrow-left.svg'

const QUARTERS_IN_YEAR = 4;
const MONTHS_IN_QUARTER = 3;

const getMonthTemporalVal = ( currentMonthIndex, monthIndex ) => Math.max(-1, Math.min(1, monthIndex - currentMonthIndex))
const getMarkerPositionStyle = ( monthTop, monthHeight, markerHeight, percent ) => ({ top: `${monthTop - (markerHeight / 2) + (monthHeight * (1 - percent))}px` })

const YearProgress = ( props ) =>
{
  const [, forceUpdate] = useReducer(x => x++, 0)

  const currentMonthRef = useRef()
  const monthProgressRef = useRef()
  
  const currentMonthHeight = currentMonthRef.current ? currentMonthRef.current.offsetHeight : 0
  const currentMonthTop = currentMonthRef.current ? currentMonthRef.current.offsetTop : 0
  const monthProgressHeight = monthProgressRef.current ? monthProgressRef.current.offsetHeight : 0
  const currentMonthProgress = (props.date.getDate() / getDaysInMonth(props.date.getYear(), props.date.getMonth()))
  
  // Force an update when the window is resized so the month progress will be positioned in the correct location
  // todo: Calculate the offset from the top in terms of relative and absolute units, and set the month progress
  // to a fixed width to avoid the need to force an update on window resize. Arguably this is a bit more brittle
  // to style changes though.
  useEffect(( ) => 
  {
    const onResize = ( ) => forceUpdate()
    window.addEventListener('resize', onResize)
    return ( ) => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="YearProgress">
      <div className="monthsCol">
        {
          Array.from({ length: QUARTERS_IN_YEAR })
          .map(( _, quarterIndex ) =>
            <div className="quarter" key={quarterIndex}>
              {
                Array.from({ length: MONTHS_IN_QUARTER })
                .map(( _, subMonthIndex ) =>
                {
                  const monthIndex = quarterIndex * MONTHS_IN_QUARTER + subMonthIndex
                  const month = MONTHS[monthIndex]
                  const temporalVal = getMonthTemporalVal(props.date.getMonth(), monthIndex)
                  const temporalClasss = { "-1": "past", "0": "present", "1": "future" }[temporalVal]

                  return <div className={["month", temporalClasss].join(' ')} ref={temporalVal === 0 ? currentMonthRef : ( ) => {}} key={monthIndex}>{month}</div>
                })
              }
              </div>
          )
        }
      </div>
      <div className="monthProgressCol">
        <div className="monthProgress" ref={monthProgressRef} style={getMarkerPositionStyle(currentMonthTop, currentMonthHeight, monthProgressHeight, currentMonthProgress)}>
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