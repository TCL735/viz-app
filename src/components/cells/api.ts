import {dailyClimate2013} from '../../data/dailyClimate2013'
import {dailyClimate2014} from '../../data/dailyClimate2014'
import {dailyClimate2015} from '../../data/dailyClimate2015'
import {dailyClimate2016} from '../../data/dailyClimate2016'
import {dailyClimate} from '../../data/dailyClimate'

import {DateRangeOptions} from '../../types'

const MIN_WAIT = 100
const MAX_WAIT = 1200

const getRandomWaitTime = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const fetchClimateData = async (dateRange: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      switch (dateRange) {
        case DateRangeOptions.Thirteen: {
          return resolve(dailyClimate2013)
        }
        case DateRangeOptions.Fourteen: {
          return resolve(dailyClimate2014)
        }
        case DateRangeOptions.Fifteen: {
          return resolve(dailyClimate2015)
        }
        case DateRangeOptions.Sixteen: {
          return resolve(dailyClimate2016)
        }
        default:
          return resolve(dailyClimate)
      }
    }, getRandomWaitTime(MIN_WAIT, MAX_WAIT))
  })
}
