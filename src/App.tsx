import React from 'react'
import {AppWrapper, Page} from '@influxdata/clockface'
import {Visualization} from './components/graph'

import {dailyClimate} from './data/dailyClimate'
import {convertCSVToFluxAnnotatedCSV} from './data/convertCSVToFluxAnnotatedCSV'
import './style/App.css'

function App() {
  const fluxResponse = convertCSVToFluxAnnotatedCSV(dailyClimate)
  return (
    <AppWrapper>
      <Page>
        <div className="App">
          <Visualization fluxResponse={fluxResponse} />
        </div>
      </Page>
    </AppWrapper>
  )
}

export default App
