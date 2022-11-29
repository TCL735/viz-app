import React, {FC} from 'react'
import {
  NINETEEN_EIGHTY_FOUR,
  Config,
  FromFluxResult,
  LayerConfig,
  Plot,
  timeFormatter,
  SimpleTableLayerConfig,
} from '@influxdata/giraffe'

import {VisualizationTypes} from '../types'
interface VisualizationProps {
  fromFluxResult: FromFluxResult
  type: string
}

const timeZone = 'America/Los_Angeles'
const timeFormat = 'YYYY-MM-DD HH:mm'
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
  const {fromFluxResult, type} = props
  const table = fromFluxResult.table

  const graphConfig: Config = {
    table,
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
        type,
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

  const tableConfig: Config = {
    fromFluxResult,
    layers: [
      {
        type,
        showAll: false,
      } as SimpleTableLayerConfig,
    ],
  }

  const config =
    type === VisualizationTypes.SimpleTable ? tableConfig : graphConfig

  return <Plot config={config}></Plot>
}
