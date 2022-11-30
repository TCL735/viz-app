import React, {FC, useEffect, useState} from 'react'
import {
  ComponentSize,
  RemoteDataState,
  TechnoSpinner,
} from '@influxdata/clockface'
import {
  Config,
  FromFluxResult,
  LayerConfig,
  Plot,
  SimpleTableLayerConfig,
  timeFormatter,
} from '@influxdata/giraffe'

import {useCustomDomain} from '../utils/useCustomDomain'
import {VisualizationTypes} from '../types'
import {DEFAULT_GRAPH_OPTIONS} from '../constants'

interface VisualizationProps {
  adaptiveZoomOn: boolean
  dateRange: string
  fromFluxResult: FromFluxResult
  type: string
}

export const Visualization: FC<VisualizationProps> = (
  props: VisualizationProps
) => {
  const {
    timeZone,
    timeFormat,
    valueAxisLabel,
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
    position,
    interpolation,
    colors,
    lineWidth,
    hoverDimension,
    shadeBelow,
    shadeBelowOpacity,
  } = DEFAULT_GRAPH_OPTIONS

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
