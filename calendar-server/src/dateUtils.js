import moonbeams from 'moonbeams'
import SunCalc from 'suncalc'


export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const THURSDAY_INDEX = 4
export const SEASONS_NORTH = ["spring", "summer", "fall", "winter"]
export const SEASONS_SOUTH = ["fall", "winter", "spring", "summer"]

export const getDateSuffix = ( date ) =>
{
   
    if( date > 10 && date < 20 )
    { // teens always use suffix 'th'
        return 'th'
    } else {
        switch( date % 10 )
        {
            case 1: return "st"
            case 2: return "nd"
            case 3: return "rd"
            default: return "th"
        }
    }
}

export const getDaysInMonth = ( year, monthIndex ) =>
    // note: using 0 for day returns the last day of the previous month
    (new Date(year, monthIndex + 1, 0)).getDate()

export const getDayOfYear = ( date ) =>
    Array.from({ length: date.getMonth() })
    .map(( _, monthIndex ) => getDaysInMonth(date.getFullYear(), monthIndex))
    .reduce(( sum, days ) => sum += days, 0)
    + date.getDate()

export const getWeekOfYear = ( date, weekStartsOnMonday = false ) =>
{
    const jan1 = new Date(date.getFullYear(), 0, 1)

    // ISO_8601: the first week of the year starts with the first Thursday
    const firstDayInFirstWeek = jan1.getDay() <= THURSDAY_INDEX

    // Calc offset needed to shift week of year increment to be on Sunday or Monday
    // If weekday starts on Monday then we need to rotate the offset used for Sunday forward by 1
    const firstWeekOffset = (((weekStartsOnMonday ? (WEEKDAYS.length - 1) : 0) + jan1.getDay()) % WEEKDAYS.length) - 1
    const weekYear = Math.floor((getDayOfYear(date) + firstWeekOffset) / WEEKDAYS.length) + (firstDayInFirstWeek ? 1 : 0)

    if( weekYear === 0 )
    {
        // Week belongs to the previous year
        // note: This function is called again on the last day of the previous year to account for leap years (which have 53 weeks)
        // instead of returning a constant 52
        return getWeekOfYear(new Date(date.getFullYear(), 0, 0))
    } else {
        return weekYear
    }
}

export const getAstroSeasons = ( year = (new Date()).getFullYear(), hemisphere = "north" ) =>
{
    console.assert(hemisphere === "north" || hemisphere === "south", `hemisphere ('${hemisphere}') must be either 'north' or 'south'.`)

    const seasons = hemisphere === "north" ? SEASONS_NORTH : SEASONS_SOUTH
    
    const jdToDate = ( jd ) =>
    {
        const cal = moonbeams.jdToCalendar(jd)
        return new Date(cal.year, cal.month - 1, cal.day)
    }

    const makeSeasonInfo = ( year, seasonIndex ) =>
    ({
        season: seasons[seasonIndex],
        start: jdToDate(moonbeams.season(seasonIndex, year)),
        end: jdToDate(moonbeams.season((seasonIndex + 1) % seasons.length, ((seasonIndex + 1) / seasons.length) < 1 ? year : year + 1 ))
    })

    return [makeSeasonInfo(year - 1, 3), makeSeasonInfo(year, 0), makeSeasonInfo(year, 1), makeSeasonInfo(year, 2), makeSeasonInfo(year, 3)]
}

export const getAstroSeason = ( date = new Date(), hemisphere = "north" ) => getAstroSeasons(date.getFullYear(), hemisphere).filter(( seasonInfo ) => date >= seasonInfo.start && date < seasonInfo.end)[0]

export const getTimeClass = ( sunset, night, sunrise, date ) =>
{
  // note: it is assumed that night starts sometime between sunset and sunrise
  // note: it is assumed sunset and sunrise are for the current day
  if( date >= sunrise && date < sunset ) return "Day"
  else if(
    ( night > sunset && date < sunrise ) ||
    (
      date >= night &&
      (
        ( night < sunrise && date < sunrise ) ||
        ( night >= sunrise && date >= sunrise )
      )
    )
  ) return "Night"
  else return "Evening"
}

export const getSunInfoFromGeo = ( geo, date ) =>
{
    // note: Using a date fixed at 12pm for SunCalc as a hack to work around SunCalc switching over the sunrise and sunset dates at 12:10am instead of 12:00am
    const {sunset, sunrise} = SunCalc.getTimes(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12), geo.lat, geo.lng)
    
    return {sunset, sunrise}
}