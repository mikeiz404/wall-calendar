import React from 'react'
import { ReactComponent as Spring } from './images/season-spring.svg'
import { ReactComponent as Summer } from './images/season-summer.svg'
import { ReactComponent as Fall } from './images/season-fall.svg'
import { ReactComponent as Winter } from './images/season-winter.svg'


const ICONS = { 'spring': Spring, 'summer': Summer, 'fall': Fall, 'winter': Winter }

const SeasonIcon = ( props ) =>
{
    const Icon = ICONS[props.season]
    return <Icon {...props}/>
}

export default SeasonIcon