// Libraries
import React, {FC} from 'react'
import {connect, ConnectedProps} from 'react-redux'
import ReactGridLayout, {WidthProvider, Layout} from 'react-grid-layout'

// Components
import {Page} from '@influxdata/clockface'
import {AddVisualizationButton} from './AddVisualizationButton'
import {Cell} from './cells/Cell'

// Types
import {RootState} from '../redux/store'

// Selectors
import {getAllCells} from './cells/selectors'

// Actions
import {setCellPosition} from './cells/actions'

const DASHBOARD_LAYOUT_ROW_HEIGHT = 40
const LAYOUT_MARGIN = 4
const Grid = WidthProvider(ReactGridLayout)

type ReduxProps = ConnectedProps<typeof connector>

export const DashboardComponent: FC<ReduxProps> = (props) => {
  const {cells, setCellPosition} = props

  const layout: Layout[] = cells.map((cell) => ({
    i: cell.id,
    x: cell.x,
    y: cell.y,
    w: cell.w,
    h: cell.h,
  }))

  const handleLayoutChange = (grid: Layout[]) => {
    cells.forEach((cell) => {
      const cellLayout = grid.find((layoutCell) => layoutCell.i === cell.id)

      if (
        cellLayout &&
        (cellLayout.x !== cell.x ||
          cellLayout.y !== cell.y ||
          cellLayout.w !== cell.w ||
          cellLayout.h !== cell.h)
      ) {
        setCellPosition({
          ...cell,
          x: cellLayout.x,
          y: cellLayout.y,
          w: cellLayout.w,
          h: cellLayout.h,
        })
      }
    })
  }

  return (
    <Page>
      <Page.Header fullWidth={true}>
        <Page.Title title="Climate Visualizations" />
      </Page.Header>
      <Page.ControlBar fullWidth={true}>
        <Page.ControlBarLeft>
          <AddVisualizationButton />
        </Page.ControlBarLeft>
      </Page.ControlBar>
      <Page.Contents fullWidth={true} scrollable={true} className="dashboard">
        <Grid
          className="layout"
          cols={12}
          layout={layout}
          margin={[LAYOUT_MARGIN, LAYOUT_MARGIN]}
          onLayoutChange={handleLayoutChange}
          rowHeight={DASHBOARD_LAYOUT_ROW_HEIGHT}
          resizeHandles={['se']}
        >
          {cells.map((cell) => (
            <div key={cell.id}>
              <Cell
                id={cell.id}
                name={cell.name}
                type={cell.type}
                dateRange={cell.dateRange}
              ></Cell>
            </div>
          ))}
        </Grid>
      </Page.Contents>
    </Page>
  )
}

const mstp = (state: RootState) => {
  return {
    cells: getAllCells(state),
  }
}

const mdtp = {
  setCellPosition,
}

const connector = connect(mstp, mdtp)

export const Dashboard = connector(DashboardComponent)
