import { React } from 'react'
import { Select } from 'antd'
import 'antd/lib/select/style/css'
import dayjs from 'dayjs'
import { LeftCircleFilled, RightCircleFilled, UpCircleFilled, DownCircleFilled, RetweetOutlined } from '@ant-design/icons'

import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import { getTimeClass, getSunInfoFromGeo } from '../../dateUtils'

import '../../Demo.scss'

const MODES = ["Day", "Evening", "Night"]

const DemoController = ( props ) =>
{
    const {sunrise, sunset} = getSunInfoFromGeo(props.geo, props.date)
    const night = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), props.nightStart.hour, props.nightStart.minute)
    const mode = getTimeClass(sunset, night, sunrise, props.date)

    const date = dayjs(props.date)
    const setDate = ( date ) =>
    {
        props.setDate(date.toDate())
    }

    const onModeSelected = ( mode ) =>
    {
        // todo: use sunrise and sunset times
        let newDate
        switch( mode )
        {
            case "Day": newDate = dayjs(sunrise); break;
            case "Evening": newDate = dayjs(sunset); break;
            case "Night": newDate = dayjs(night); break;
            default: throw new Error(`Unahndled mode: '${mode}'`);
        }

        setDate(newDate)
    }

    const onCycleMode = ( ) =>
    {
        const nextMode = MODES[(MODES.indexOf(mode) + 1) % MODES.length]
        onModeSelected(nextMode)
    }

    return (
        <div className="DemoController">
            <div className="control date">
                <span className="label">Date:</span>
                <LeftCircleFilled onClick={( ) => setDate(date.subtract(1, 'month'))} className="button left"/>
                <DatePicker
                    value={date}
                    onChange={setDate}
                    format="MM/DD/YY"
                    allowClear={false}
                    className="input"
                />
                <RightCircleFilled onClick={( ) => setDate(date.add(1, 'month'))} className="button right"/>
            </div>
            <div className="control time">
                <span className="label">Time:</span>
                <DownCircleFilled onClick={( ) => setDate(date.subtract(1, 'hour'))} className="button left"/>
                <TimePicker
                    value={date}
                    onChange={setDate}
                    format="hh:mm a"
                    minuteStep={5}
                    use12Hours={true}
                    allowClear={false}
                    className="input"
                />
                <UpCircleFilled onClick={( ) => setDate(date.add(1, 'hour'))} className="button right"/>
            </div>
            <div className="control mode">
                <span className="label">Mode:</span>
                <Select
                    value={mode}
                    onChange={onModeSelected}
                    className="input"
                >
                    { MODES.map(( (mode, i) => <Select.Option key={mode}>{mode}</Select.Option> ))}
                </Select>
                <RetweetOutlined onClick={ onCycleMode } className="button right"/>
            </div>
        </div>
    )
}

export default DemoController