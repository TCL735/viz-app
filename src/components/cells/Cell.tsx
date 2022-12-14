import React, {FC, useEffect, useState} from 'react'
import {connect, ConnectedProps} from 'react-redux'
import {
  ButtonShape,
  ComponentColor,
  ComponentSize,
  ConfirmationButton,
  IconFont,
  InputLabel,
  RemoteDataState,
  SlideToggle,
  TechnoSpinner,
} from '@influxdata/clockface'
import {fromFlux, FromFluxResult, newTable} from '@influxdata/giraffe'

import {Visualization} from '../Visualization'
import {DateRangeSelector} from '../DateRangeSelector'

import {fetchClimateData} from './api'
import {
  mapCSVtoFluxForGraphs,
  mapCSVtoFluxForTables,
} from '../../utils/mapCSVtoFlux'

import {deleteCell} from './actions'
import {VisualizationTypes} from '../../types'
import {INITIAL_DATE_RANGE} from '../../constants'

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
  const {deleteCell, id, dateRange, type} = props
  const [selectedDateRange, setSelectedDateRange] = useState<string>(
    dateRange === INITIAL_DATE_RANGE ? 'All Dates' : dateRange
  )
  const [fromFluxResult, setFromFluxResult] = useState<FromFluxResult>(
    initialFromFluxResult
  )
  const [apiStatus, setApiStatus] = useState<RemoteDataState>(
    RemoteDataState.NotStarted
  )
  const [adaptiveZoomOn, setAdaptiveZoomOn] = useState<boolean>(true)

  useEffect(() => {
    setApiStatus(RemoteDataState.Loading)
    fetchClimateData(selectedDateRange).then((climateData) => {
      const fluxResponse =
        type === VisualizationTypes.SimpleTable
          ? mapCSVtoFluxForTables(climateData)
          : mapCSVtoFluxForGraphs(climateData)

      setFromFluxResult(fromFlux(fluxResponse))
      setApiStatus(RemoteDataState.Done)
    })
  }, [selectedDateRange]) // eslint-disable-line react-hooks/exhaustive-deps

  const {name} = props

  const handleDeleteCell = () => {
    deleteCell(id)
  }

  const handleSelectDateRange = (selection: string) => {
    setSelectedDateRange(selection)
  }

  const cellBody =
    fromFluxResult.table.length > 0 ? (
      <div className="cell-body">
        <Visualization
          adaptiveZoomOn={adaptiveZoomOn}
          dateRange={selectedDateRange}
          type={type}
          fromFluxResult={fromFluxResult}
        />
        {apiStatus === RemoteDataState.Loading ? (
          <TechnoSpinner
            className="loading-spinner"
            strokeWidth={ComponentSize.Large}
          />
        ) : null}
      </div>
    ) : (
      <div className="cell-body">
        <TechnoSpinner
          className="loading-spinner"
          strokeWidth={ComponentSize.Large}
        />
      </div>
    )

  return (
    <div className="cell">
      <div className="cell-header">
        <div className="cell-name">{name}</div>
        {type !== VisualizationTypes.SimpleTable ? (
          <>
            <InputLabel className="cell-label-adaptive-zoom">
              Adaptive Zoom
            </InputLabel>
            <SlideToggle
              className="cell-toggle-adaptive-zoom"
              active={adaptiveZoomOn}
              size={ComponentSize.ExtraSmall}
              onChange={() => setAdaptiveZoomOn(!adaptiveZoomOn)}
              tooltipText={adaptiveZoomOn ? 'ON' : 'OFF'}
            />
          </>
        ) : null}
        <DateRangeSelector
          className="cell-dropdown-date-range"
          selectedDateRange={selectedDateRange}
          handleSelectDateRange={handleSelectDateRange}
        />
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
      {cellBody}
      <div className="cell-footer"></div>
    </div>
  )
}

const mdtp = {
  deleteCell,
}

const connector = connect(null, mdtp)

export const Cell = connector(CellComponent)
