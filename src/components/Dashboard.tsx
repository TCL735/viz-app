import React, {FC} from 'react'
import ReactGridLayout, {WidthProvider, Layout} from 'react-grid-layout'
import {Page} from '@influxdata/clockface'
import {Cell} from './Cell'
import {Visualization} from './Visualization'

import {dailyClimate} from '../data/dailyClimate'
import {convertCSVToFluxAnnotatedCSV} from '../data/convertCSVToFluxAnnotatedCSV'
const DASHBOARD_LAYOUT_ROW_HEIGHT = 40
const LAYOUT_MARGIN = 4
const Grid = WidthProvider(ReactGridLayout)
export const Dashboard: FC = () => {
  const fluxResponse = convertCSVToFluxAnnotatedCSV(dailyClimate)

  const layout: Layout[] = [
    {i: 'a', x: 0, y: 0, w: 3, h: 4},
    {i: 'b', x: 0, y: 0, w: 3, h: 4},
    {i: 'c', x: 0, y: 0, w: 3, h: 4},
  ]

  const handleLayoutChange = (grid: any) => {
    console.log('~~~ layoutChanged: received grid:', grid)
  }
  return (
    <Page>
      <Page.Header fullWidth={true}>
        <Page.Title title="Climate Visualization" />
      </Page.Header>
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
          <div key="a">
            <Cell>
              <Visualization fluxResponse={fluxResponse} />
            </Cell>
          </div>
          <div key="b">
            <Cell>hello there</Cell>
          </div>
          <div key="c">
            <Cell>and what do we have here?</Cell>
          </div>
        </Grid>
      </Page.Contents>
    </Page>
  )
}
