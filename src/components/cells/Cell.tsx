import React, {FC, useEffect, useState} from 'react'
import {fromFlux, FromFluxResult, newTable} from '@influxdata/giraffe'

import {Visualization} from '../Visualization'

import {fetchClimateData} from './api'
import {convertCSVToFluxAnnotatedCSV} from '../../data/convertCSVToFluxAnnotatedCSV'

const initialFromFluxResult: FromFluxResult = {
  table: newTable(0),

  fluxGroupKeyUnion: [],

  resultColumnNames: [],
}

interface CellProps {
  name: string
  type: string
  dateRange: string
}

export const Cell: FC<CellProps> = (props) => {
  const {type} = props
  const [fromFluxResult, setFromFluxResult] = useState<FromFluxResult>(
    initialFromFluxResult
  )

  useEffect(() => {
    fetchClimateData(props.dateRange).then((climateData) => {
      const fluxResponse = convertCSVToFluxAnnotatedCSV(climateData)
      setFromFluxResult(fromFlux(fluxResponse))
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const {name} = props

  if (!fromFluxResult.table.length) {
    return null
  }

  return (
    <div className="cell">
      <div className="cell-name">{name}</div>
      <Visualization type={type} fromFluxResult={fromFluxResult} />
    </div>
  )
}
