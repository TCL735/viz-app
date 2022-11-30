import {getRandomNumber} from './random'

const startTime = '2013-01-01T00:00:00Z'
const endTime = '2017-01-01T07:59:59Z'
const currentHour = 'T08:00:00Z'

const DESIRED_POINTS_PER_GRAPH = 720

interface AnnotatedTable {
  [key: string]: string
}

const resultLabelForDailyClimate: AnnotatedTable = {
  'mean temp': 'Celsius',
  humidity: 'g/m^3',
  'wind speed': 'km/h',
  'mean pressure': 'centibars',
}

interface MeasurementRanges {
  [key: string]: number[]
}
const measurementRange1: MeasurementRanges = {
  'mean temp': [6, 25],
  humidity: [55, 75],
  'wind speed': [0, 15],
  'mean pressure': [90, 100],
}

const measurementRange2: MeasurementRanges = {
  'mean temp': [15, 30],
  humidity: [65, 80],
  'wind speed': [12, 24],
  'mean pressure': [95, 100],
}

const measurementRange3: MeasurementRanges = {
  'mean temp': [6, 40],
  humidity: [60, 90],
  'wind speed': [10, 36],
  'mean pressure': [85, 105],
}

// this converts the static data files to Flux for graphs
export const mapCSVtoFluxForGraphs = (csv: string): string => {
  const annotatedCSVHeader = `#group,false,false,true,true,false,false,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string`

  const entries = csv.split('\n')
  const annotatedCSVTables: AnnotatedTable = {}

  let csvHeader: string[] = []
  entries.forEach((entry, index) => {
    if (index === 0) {
      csvHeader = entry.split(',')
    } else {
      const values = entry.split(',')
      let date: string = ''
      values.forEach((value, headerIndex) => {
        if (headerIndex === 0) {
          date = `${value}${currentHour}`
        } else {
          if (!annotatedCSVTables[headerIndex - 1]) {
            annotatedCSVTables[headerIndex - 1] = `${annotatedCSVHeader}
#default,${resultLabelForDailyClimate[csvHeader[headerIndex]]},,,,,,
,result,table,_start,_stop,_time,_value,_measurement`
          }
          annotatedCSVTables[headerIndex - 1] = annotatedCSVTables[
            headerIndex - 1
          ].concat(`
,,${headerIndex - 1},${startTime},${endTime},${date},${value},${
            csvHeader[headerIndex]
          }`)
        }
      })
    }
  })

  return Object.values(annotatedCSVTables).join('\n\n')
}

/*
  This attempts to create more fine-grained data for adaptive zoom

  TODO: make the random dataa trend more naturally rather than chaotically
        as climate can have long periods of stable weather
 */
export const createFluxForGraphsFromDomain = (domain: number[]): string => {
  const annotatedCSVHeader = `#group,false,false,true,true,false,false,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string`

  const annotatedCSVTables: AnnotatedTable = {}
  const begin = new Date(domain[0]).getTime()
  const end = new Date(domain[1]).getTime()

  const interval = (end - begin) / DESIRED_POINTS_PER_GRAPH

  Object.keys(resultLabelForDailyClimate).forEach((measurement, index) => {
    annotatedCSVTables[measurement] = `${annotatedCSVHeader}
#default,${resultLabelForDailyClimate[measurement]},,,,,,
,result,table,_start,_stop,_time,_value,_measurement
`
    for (let i = 0; i < DESIRED_POINTS_PER_GRAPH; i += 1) {
      let date = new Date(begin + i * interval).toISOString()
      let measurementRange = measurementRange1[measurement]
      if (
        i >= DESIRED_POINTS_PER_GRAPH / 3 &&
        i < (2 * DESIRED_POINTS_PER_GRAPH) / 3
      ) {
        measurementRange = measurementRange3[measurement]
      } else if (i >= (2 * DESIRED_POINTS_PER_GRAPH) / 3) {
        measurementRange = measurementRange2[measurement]
      }
      let value = getRandomNumber(measurementRange[0], measurementRange[1])
      annotatedCSVTables[
        measurement
      ] += `,,${index},${startTime},${endTime},${date},${value},${measurement}
`
    }
  })

  return Object.values(annotatedCSVTables).join('\n\n')
}

// this converts the static data files to Flux for tables
export const mapCSVtoFluxForTables = (csv: string): string => {
  let fluxResponse = `#group,false,false,true,true,false,false,false,false,false,false
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,double,double,double,double
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,mean temp,humidity,wind speed,mean pressure
`
  const entries = csv.split('\n')

  entries.forEach((entry, index) => {
    if (index === 0 || entry.length === 0) {
      return
    }
    fluxResponse =
      fluxResponse.concat(`,,0,${startTime},${endTime},${entry.slice(
        0,
        10
      )}${currentHour},${entry.slice(11)}
`)
  })
  return fluxResponse
}

/*
  Converts pressure from millibars to centibars
    This was needed for the original data which was in millibars.
    Our line and scatter graphs use the same scale for values all types
    of measurements, and pressure was the only measurement at or around
    1,000 units. Everything else was roughly at or less 100 units,
    making the graph look stretched.

    By converting units, we unstretch the graph by scaling down the pressure
    measurement closer to the other measurements on the line and scatter graphs
*/
export const updateMeanPressure = (csv: string): string => {
  const rows = csv.split('\n')
  rows.forEach((row, index) => {
    if (index !== 0) {
      const columns = row.split(',')
      columns[columns.length - 1] = String(
        Number(columns[columns.length - 1]) / 10
      )
      rows[index] = columns.join(',')
    }
  })
  return rows.join('\n')
}
