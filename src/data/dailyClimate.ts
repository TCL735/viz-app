import {dailyClimate2013} from './dailyClimate2013'
import {dailyClimate2014} from './dailyClimate2014'
import {dailyClimate2015} from './dailyClimate2015'
import {dailyClimate2016} from './dailyClimate2016'

const climate2013 = dailyClimate2013.split('\n')
climate2013.shift()
const climate2014 = dailyClimate2014.split('\n')
climate2014.shift()
const climate2015 = dailyClimate2015.split('\n')
climate2015.shift()
const climate2016 = dailyClimate2016.split('\n')
climate2016.shift()

export const dailyClimate = [
  'date,mean temp,humidity,wind speed,mean pressure',
  ...climate2013,
  ...climate2014,
  ...climate2015,
  ...climate2016,
].join('\n')
