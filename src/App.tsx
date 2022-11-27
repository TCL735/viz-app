import React from 'react'
import {AppWrapper} from '@influxdata/clockface'
import {Dashboard} from './components/Dashboard'

import './style/App.css'

function App() {
  return (
    <AppWrapper className="App">
      <Dashboard />
    </AppWrapper>
  )
}

export default App
