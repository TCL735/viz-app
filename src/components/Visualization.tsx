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
import {extent} from '../utils/useVisDomain'

interface VisualizationProps {
  fromFluxResult: FromFluxResult
  type: string
}

const timeZone = 'America/Los_Angeles'
const timeFormat = 'YYYY-MM-DD HH:mm'
const valueAxisLabel = ''
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

const includeXDomainZoom = true
const onSetXDomain = (domain: number[]) => {
  console.log('onSetXDomain: domain', domain)
}

const onResetXDomain = () => {
  console.log('onResetXDomain')
}

const includeYDomainZoom = true
const onSetYDomain = (domain: number[]) => {
  console.log('onSetYDomain: domain', domain)
}

const onResetYDomain = () => {
  console.log('onResetYDomain')
}

export const Visualization: FC<VisualizationProps> = (
  props: VisualizationProps
) => {
  const {fromFluxResult, type} = props
  const table = fromFluxResult.table

  // console.log('table:', table)
  // console.log(
  //   'extent of time column',
  //   extent(table.getColumn('_time') as number[])
  // )
  const graphConfig: Config = {
    table,
    valueFormatters: {
      _time: timeFormatter({timeZone, format: timeFormat}),
      _value: (val: number) =>
        `${val.toFixed(2)}${
          valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
        }`,
    },
    xScale,
    yScale,
    tickFont,
    xTotalTicks,
    yTotalTicks,
    xDomain: extent(table.getColumn('_time') as number[]) as number[],
    includeXDomainZoom,
    onSetXDomain,
    onResetXDomain,
    yDomain: extent(table.getColumn('_value') as number[]) as number[],
    includeYDomainZoom,
    onSetYDomain,
    onResetYDomain,
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
