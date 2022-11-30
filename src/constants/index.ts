import {NINETEEN_EIGHTY_FOUR} from '@influxdata/giraffe'

export const INITIAL_DATE_RANGE = 'Select the date range'

export const MAXIMUM_CELL_NAME_LENGTH = 20

export const DEFAULT_GRAPH_OPTIONS = {
  timeZone: 'America/Los_Angeles',
  timeFormat: 'YYYY-MM-DD HH:mm:ss',
  valueAxisLabel: '',
  xScale: 'linear',
  yScale: 'linear',
  tickFont: '14px sans-serif',
  xTotalTicks: 9,
  yTotalTicks: 11,
  legendFont: '12px sans-serif',
  legendOpacity: 1.0,
  legendOrientationThreshold: 5,
  legendColorizeRows: true,
  showAxes: true,
  position: 'overlaid',
  interpolation: 'monotoneX',
  colors: NINETEEN_EIGHTY_FOUR,
  lineWidth: 1,
  hoverDimension: 'auto',
  shadeBelow: false,
  shadeBelowOpacity: 0.1,
}

export const DEFAULT_CELL_LAYOUT_DIMENSIONS = {
  x: 0,
  y: 0,
  w: 12,
  h: 10,
  minW: 4,
  minH: 3,
}
