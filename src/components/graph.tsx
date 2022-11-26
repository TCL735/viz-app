import React, {FC} from 'react'
import {
  NINETEEN_EIGHTY_FOUR,
  Config,
  LayerConfig,
  Plot,
  Table,
  fromFlux,
  timeFormatter,
} from '@influxdata/giraffe'
import {PlotContainer} from './PlotContainer'
import {getRandomTable} from '../utils/randomTable'

interface VisualizationProps {
  fluxResponse?: string
}

const maxValue = Math.random() * Math.floor(200)
const includeNegativeNumbers = false
const lines = 4
const fillColumnsCount = 5
const fillColumnNameLength = 4
const timeZone = 'America/Los_Angeles'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
const valueAxisLabel = ''
const includeYDomainZoom = false
const xScale = 'linear'
const yScale = 'linear'
const tickFont = '10px sans-serif'
const xTotalTicks = 10
const yTotalTicks = 10
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

export const Visualization: FC<VisualizationProps> = (
  props: VisualizationProps
) => {
  const {fluxResponse} = props
  let table: Table

  if (!fluxResponse) {
    table = getRandomTable(
      maxValue,
      includeNegativeNumbers,
      lines * 20,
      20,
      fillColumnsCount,
      fillColumnNameLength
    )
  } else {
    table = fromFlux(fluxResponse).table
  }

  const config: Config = {
    valueFormatters: {
      _time: timeFormatter({timeZone, format: timeFormat}),
      _value: (val: number) =>
        `${val.toFixed(2)}${
          valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
        }`,
    },
    includeYDomainZoom,
    onSetYDomain: () => {},
    onResetYDomain: () => {},
    xScale,
    yScale,
    tickFont,
    xTotalTicks,
    yTotalTicks,
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

  if (!fluxResponse) {
    config.table = table
  } else {
    config.fluxResponse = fluxResponse
  }

  return (
    <PlotContainer>
      <Plot config={config}></Plot>
    </PlotContainer>
  )
}
