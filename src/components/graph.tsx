import React, {FC} from 'react'
import {
  NINETEEN_EIGHTY_FOUR,
  LayerConfig,
  Plot,
  timeFormatter,
} from '@influxdata/giraffe'
import {PlotContainer} from './PlotContainer'
import {getRandomTable} from '../utils/randomTable'

const maxValue = Math.random() * Math.floor(200)
const includeNegativeNumbers = false
const lines = 4
const fillColumnsCount = 5
const fillColumnNameLength = 4
const timeZone = 'America/Los_Angeles'
const timeFormat = 'YYYY-MM-DD HH:mm:ss ZZ'
const valueAxisLabel = 'foo'
const yDomainMin = 0
const yDomainMax = maxValue
const includeYDomainZoom = false
const xScale = 'linear'
const yScale = 'linear'
const tickFont = '10px sans-serif'
const legendFont = '12px sans-serif'
const legendOpacity = 1.0
const legendOrientationThreshold = 5
const legendColorizeRows = true
const showAxes = true
const position = 'overlaid'
const interpolation = 'monotoneX'
const colors = NINETEEN_EIGHTY_FOUR
const lineWidth = 1
const hoverDimension = 'auto'
const shadeBelow = false
const shadeBelowOpacity = 0.1

export const Graph: FC = () => {
  const table = getRandomTable(
    maxValue,
    includeNegativeNumbers,
    lines * 20,
    20,
    fillColumnsCount,
    fillColumnNameLength
  )

  const config = {
    table,
    valueFormatters: {
      _time: timeFormatter({timeZone, format: timeFormat}),
      _value: (val: number) =>
        `${val.toFixed(2)}${
          valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
        }`,
    },
    yDomain: [yDomainMin, yDomainMax],
    includeYDomainZoom,
    onSetYDomain: () => {},
    onResetYDomain: () => {},
    xScale,
    yScale,
    tickFont,
    legendFont,
    legendOpacity,
    legendOrientationThreshold,
    legendColorizeRows,
    showAxes,
    layers: [
      {
        type: 'line',
        x: '_time',
        y: '_value',
        fill: table.columnKeys.filter(
          (k) => table.getColumnType(k) === 'string'
        ),
        position,
        interpolation,
        colors,
        lineWidth,
        hoverDimension,
        shadeBelow,
        shadeBelowOpacity,
      } as LayerConfig,
    ],
  }
  return (
    <PlotContainer>
      <Plot config={config}></Plot>
    </PlotContainer>
  )
}
