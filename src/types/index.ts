export interface Cell {
  id: string
  name: string
  type: string
  dateRange: string
  x: number
  y: number
  w: number
  h: number
}

export enum VisualizationTypes {
  Line = 'line',
  Scatter = 'scatter',
  SimpleTable = 'simple table',
}

export enum DateRangeOptions {
  All = 'All Dates',
  Thirteen = '2013',
  Fourteen = '2014',
  Fifteen = '2015',
  Sixteen = '2016',
}
