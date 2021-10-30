import moonbeams from 'moonbeams'



export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

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
    .map(( _, monthIndex ) => getDaysInMonth(date.getYear(), monthIndex))
    .reduce(( sum, days ) => sum += days, 0)
    + date.getDate()

export const getWeekOfYear = ( date ) => Math.floor(getDayOfYear(date) / WEEKDAYS.length) + 1

export const getAstroSeasons = ( year = (new Date()).getFullYear(), hemisphere = "north" ) =>
{
    console.assert(hemisphere === "north" || hemisphere === "south", `hemisphere ('${hemisphere}') must be either 'north' or 'south'.`)

    const seasons = hemisphere === "north" ? ["spring", "summer", "fall", "winter"] : ["fall", "winter", "spring", "summer"]
    
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