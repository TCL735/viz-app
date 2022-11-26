const startTime = '2013-01-01T00:00:00Z'
const endTime = '2017-01-01T23:00:00Z'
const currentHour = 'T08:00:00Z'

interface AnnotatedTable {
  [key: string]: string
}

const resultLabelForDailyClimate: AnnotatedTable = {
  'mean temp': 'Celsius',
  humidity: 'g/m^3',
  'wind speed': 'km/h',
  'mean pressure': 'centibars',
}

export const convertCSVToFluxAnnotatedCSV = (csv: string): string => {
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
