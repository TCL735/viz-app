import React, {FC, useEffect, useState} from 'react'
import {connect, ConnectedProps} from 'react-redux'
import {
  ButtonShape,
  ComponentColor,
  ComponentSize,
  ConfirmationButton,
  IconFont,
} from '@influxdata/clockface'
import {fromFlux, FromFluxResult, newTable} from '@influxdata/giraffe'

import {Visualization} from '../Visualization'

import {fetchClimateData} from './api'
import {convertCSVToFluxAnnotatedCSV} from '../../data/convertCSVToFluxAnnotatedCSV'

import {deleteCell} from './actions'

const initialFromFluxResult: FromFluxResult = {
  table: newTable(0),

  fluxGroupKeyUnion: [],

  resultColumnNames: [],
}

type ReduxProps = ConnectedProps<typeof connector>
interface CellProps {
  id: string
  name: string
  type: string
  dateRange: string
}

const CellComponent: FC<CellProps & ReduxProps> = (props) => {
  const {deleteCell, id, type} = props
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

  const handleDeleteCell = () => {
    deleteCell(id)
  }

  if (!fromFluxResult.table.length) {
    return null
  }

  return (
    <div className="cell">
      <div className="cell-header">
        <div className="cell-name">{name}</div>
        <ConfirmationButton
          color={ComponentColor.Secondary}
          icon={IconFont.Trash_New}
          shape={ButtonShape.Square}
          size={ComponentSize.ExtraSmall}
          confirmationLabel="Yes, delete this visualization"
          onConfirm={handleDeleteCell}
          confirmationButtonText="Confirm"
        />
      </div>
      <div className="cell-body">
        <Visualization type={type} fromFluxResult={fromFluxResult} />
      </div>
    </div>
  )
}

const mdtp = {
  deleteCell,
}

const connector = connect(null, mdtp)

export const Cell = connector(CellComponent)
