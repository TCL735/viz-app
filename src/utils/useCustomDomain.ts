import {useEffect, useMemo, useRef, useState} from 'react'
import {RemoteDataState} from '@influxdata/clockface'
import {fromFlux, FromFluxResult} from '@influxdata/giraffe'
import {isEqual} from 'lodash'

import {requeryClimatData} from '../components/cells/api'
import {DateRangeOptions} from '../types'

const useOneWayState = (defaultState: any) => {
  const isFirstRender = useRef(true)
  const [state, setState] = useState(defaultState)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false

      return
    }

    setState(defaultState)
  }, [defaultState])

  return [state, setState]
}

const extent = (dataArray: number[]): [number, number] | null => {
  if (!dataArray || !dataArray.length) {
    return null
  }

  let low = Infinity
  let high = -Infinity

  for (const num of dataArray) {
    if (num < low) {
      low = num
    }

    if (num > high) {
      high = num
    }
  }

  if (low === Infinity || high === -Infinity) {
    return null
  }

  return [low, high]
}

const getStartTime = (timeRange: string): number => {
  switch (timeRange) {
    case DateRangeOptions.Fourteen: {
      return new Date(`${DateRangeOptions.Fourteen}-01-01T08:00:00Z`).getTime()
    }
    case DateRangeOptions.Fifteen: {
      return new Date(`${DateRangeOptions.Fifteen}-01-01T08:00:00Z`).getTime()
    }
    case DateRangeOptions.Sixteen: {
      return new Date(`${DateRangeOptions.Sixteen}-01-01T08:00:00Z`).getTime()
    }
    default:
      return new Date(`${DateRangeOptions.Thirteen}-01-01T08:00:00Z`).getTime()
  }
}

const getEndTime = (timeRange: string): number => {
  switch (timeRange) {
    case DateRangeOptions.Thirteen: {
      return new Date(`${DateRangeOptions.Fourteen}-01-01T07:59:59Z`).getTime()
    }
    case DateRangeOptions.Fourteen: {
      return new Date(`${DateRangeOptions.Fifteen}-01-01T07:59:59Z`).getTime()
    }
    case DateRangeOptions.Fifteen: {
      return new Date(`${DateRangeOptions.Sixteen}-01-01T07:59:59Z`).getTime()
    }
    default:
      return new Date(`2017-01-01T07:59:59Z`).getTime()
  }
}

const getValidRange = (data: number[] = [], timeRange: string | null) => {
  const range = extent(data as number[])
  if (timeRange === null) {
    return range
  }
  if (range && range.length >= 2) {
    const startTime = getStartTime(timeRange)
    const endTime = getEndTime(timeRange)
    const start = Math.min(startTime, range[0])
    const end = Math.max(endTime, range[1])
    return [start, end]
  }
  return range
}

interface CustomDomainArgs {
  adaptiveZoomOn: boolean
  data: number[]
  dateRange?: string
  parsedResult: FromFluxResult
  preZoomResult: FromFluxResult | null
  setPreZoomResult: Function
  setRequeryStatus: Function
  setResult: Function
}

export const useCustomDomain = (options: CustomDomainArgs) => {
  const {
    adaptiveZoomOn,
    data,
    dateRange = null,
    parsedResult,
    preZoomResult,
    setPreZoomResult,
    setRequeryStatus,
    setResult,
  } = options

  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(
    dateRange
  )

  const initialDomain = useMemo(() => getValidRange(data, dateRange), [data]) // eslint-disable-line react-hooks/exhaustive-deps
  const [preZoomDomain, setPreZoomDomain] = useOneWayState(initialDomain)

  const [domain, setDomain] = useState(initialDomain)

  useEffect(() => {
    if (adaptiveZoomOn && dateRange && !isEqual(preZoomDomain, domain)) {
      setRequeryStatus(RemoteDataState.Loading)
      requeryClimatData(domain as number[]).then((climateData) => {
        setResult(fromFlux(climateData))
        setRequeryStatus(RemoteDataState.Done)
      })
    }
  }, [domain]) // eslint-disable-line react-hooks/exhaustive-deps

  /*
    When not zoomed in:
      - sync the preZoomDomain and the domain if they aren't the same, or
      - if it is the time axis and the dates have changed

    When zoomed in:
      - if it is the time axis and the the dates have changed,
        reset the zoom back to default; this is needed because
        a new date range will cause a fetch which means the
        parent state wants to clear out the preZoomResult
  */
  useEffect(() => {
    if (
      !preZoomResult &&
      (!isEqual(preZoomDomain, domain) ||
        (dateRange && !isEqual(dateRange, selectedTimeRange)))
    ) {
      setSelectedTimeRange(dateRange)
      setDomain(preZoomDomain)
    } else if (dateRange && !isEqual(dateRange, selectedTimeRange)) {
      setRequeryStatus(RemoteDataState.NotStarted)
      if (preZoomResult) {
        setResult(preZoomResult)
        setPreZoomResult(null)
      }
      setDomain(preZoomDomain)
    }
  }, [domain, preZoomDomain, preZoomResult, selectedTimeRange, dateRange]) // eslint-disable-line react-hooks/exhaustive-deps

  // cross axis syncing:
  //   time axis zoom changes the limits of the value axis
  useEffect(() => {
    if (!dateRange) {
      setDomain(preZoomDomain)
    }
  }, [preZoomDomain, dateRange])

  // If the use decides to toggle Adaptive Zoom, then reset the zoom to default
  useEffect(() => {
    if (preZoomResult) {
      setResult(preZoomResult)
      setDomain(preZoomDomain)
    }
  }, [adaptiveZoomOn]) // eslint-disable-line react-hooks/exhaustive-deps

  // If adaptive zoom is off, then return simpler handlers
  if (!adaptiveZoomOn) {
    const setDomain = (domain: number[]) => {
      setPreZoomDomain(domain)
    }

    const resetDomain = () => {
      setPreZoomDomain(initialDomain)
    }
    return [preZoomDomain, setDomain, resetDomain]
  }

  // Otherwise use more sophisticated handlers for adpative zoom
  const setZoomDomain = (updatedDomain: number[]) => {
    setRequeryStatus(RemoteDataState.NotStarted)
    if (!preZoomResult) {
      setPreZoomResult(parsedResult)
    }
    setDomain(updatedDomain)
  }

  const resetZoomDomain = () => {
    setRequeryStatus(RemoteDataState.NotStarted)
    if (preZoomResult) {
      setResult(preZoomResult)
      setPreZoomResult(null)
    }
    setDomain(preZoomDomain)
  }

  return [domain, setZoomDomain, resetZoomDomain]
}
