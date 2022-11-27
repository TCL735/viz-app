import React from 'react'
import ReactGridLayout, {WidthProvider, Layout} from 'react-grid-layout'
import {AppWrapper, Page} from '@influxdata/clockface'
import {Cell} from './components/Cell'
import {Visualization} from './components/Visualization'

import {dailyClimate} from './data/dailyClimate'
import {convertCSVToFluxAnnotatedCSV} from './data/convertCSVToFluxAnnotatedCSV'
import './style/App.css'

const DASHBOARD_LAYOUT_ROW_HEIGHT = 40
const LAYOUT_MARGIN = 4
const Grid = WidthProvider(ReactGridLayout)
function App() {
  const fluxResponse = convertCSVToFluxAnnotatedCSV(dailyClimate)

  const layout: Layout[] = [
    {i: 'a', x: 0, y: 0, w: 3, h: 4},
    {i: 'b', x: 8, y: 12, w: 3, h: 4},
  ]

  const handleLayoutChange = (grid: any) => {
    console.log('~~~ layoutChanged: received grid:', grid)
  }
  return (
    <AppWrapper className="App">
      <Page>
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
          </Grid>
        </Page.Contents>
      </Page>
    </AppWrapper>
  )
}

export default App
