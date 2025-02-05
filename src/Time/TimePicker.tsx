import * as React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'

import {
  inputTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  toHourInputFormat,
  toHourOutputFormat,
} from './timeUtils'

import AnalogClock, { circleSize } from './AnalogClock'
import TimeInputs from './TimeInputs'
import { withTheme } from 'react-native-paper'

type onChangeFunc = ({
  hours,
  minutes,
  focused,
}: {
  hours: number
  minutes: number
  focused?: undefined | PossibleClockTypes
}) => any

function TimePicker({
  hours,
  minutes,
  onFocusInput,
  focused,
  inputType,
  onChange,
  locale,
  theme,
}: {
  locale?: undefined | string
  inputType: PossibleInputTypes
  focused: PossibleClockTypes
  hours: number
  minutes: number
  onFocusInput: (type: PossibleClockTypes) => any
  onChange: onChangeFunc
  theme: ReactNativePaper.Theme
}) {
  const dimensions = useWindowDimensions()
  const isLandscape = dimensions.width > dimensions.height

  // method to check whether we have 24 hours in clock or 12
  const is24Hour = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    })
    const formatted = formatter.format(new Date(Date.UTC(2020, 1, 1, 23)))
    return formatted.includes('23')
  }, [locale])

  const onInnerChange = React.useCallback<onChangeFunc>(
    (params) => {
      params.hours = toHourOutputFormat(params.hours, hours, is24Hour)
      onChange(params)
    },
    [onChange, hours, is24Hour]
  )

  return (
    <View style={isLandscape ? styles.rootLandscape : styles.rootPortrait}>
      <TimeInputs
        inputType={inputType}
        hours={hours}
        minutes={minutes}
        is24Hour={is24Hour}
        onChange={onChange}
        onFocusInput={onFocusInput}
        focused={focused}
        theme={theme}
      />
      {inputType === inputTypes.picker ? (
        <View style={styles.clockContainer}>
          <AnalogClock
            hours={toHourInputFormat(hours, is24Hour)}
            minutes={minutes}
            focused={focused}
            is24Hour={is24Hour}
            onChange={onInnerChange}
            theme={theme}
          />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  rootLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24 * 3 + 96 * 2 + 52 + circleSize,
  },
  rootPortrait: {},
  clockContainer: { paddingTop: 36, paddingLeft: 12, paddingRight: 12 },
})

export default withTheme(React.memo(TimePicker))
