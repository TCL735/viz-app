import React, {FC, useEffect, useState} from 'react'
import {
  ComponentSize,
  RemoteDataState,
  TechnoSpinner,
} from '@influxdata/clockface'
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
import {useCustomDomain} from '../utils/useCustomDomain'

interface VisualizationProps {
  adaptiveZoomOn: boolean
  dateRange: string
  fromFluxResult: FromFluxResult
  type: string
}

const timeZone = 'America/Los_Angeles'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
const valueAxisLabel = ''
const xScale = 'linear'
const yScale = 'linear'
const tickFont = '10px sans-serif'
const xTotalTicks = 9
const yTotalTicks = 11
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
  const {adaptiveZoomOn, dateRange, fromFluxResult, type} = props

  const [resultState, setResultState] = useState(fromFluxResult)
  const [preZoomResult, setPreZoomResult] = useState<FromFluxResult | null>(
    null
  )
  const [requeryStatus, setRequeryStatus] = useState<RemoteDataState>(
    RemoteDataState.NotStarted
  )

  useEffect(() => {
    setResultState(fromFluxResult)
  }, [fromFluxResult])

  const table = resultState.table

  const [xDomain, setXDomain, resetXDomain] = useCustomDomain({
    adaptiveZoomOn,
    data: table.getColumn('_time') as number[],
    dateRange,
    parsedResult: resultState,
    preZoomResult,
    setPreZoomResult,
    setRequeryStatus,
    setResult: setResultState,
  })

  const [yDomain, setYDomain, resetYDomain] = useCustomDomain({
    adaptiveZoomOn,
    data: table.getColumn('_value') as number[],
    parsedResult: resultState,
    preZoomResult,
    setPreZoomResult,
    setRequeryStatus,
    setResult: setResultState,
  })

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
    xDomain,
    onSetXDomain: setXDomain,
    onResetXDomain: resetXDomain,
    yDomain,
    onSetYDomain: setYDomain,
    onResetYDomain: resetYDomain,
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

  return (
    <>
      {adaptiveZoomOn && requeryStatus === RemoteDataState.Loading ? (
        <TechnoSpinner
          className="loading-spinner"
          strokeWidth={ComponentSize.Large}
        />
      ) : (
        <Plot config={config}></Plot>
      )}
    </>
  )
}
