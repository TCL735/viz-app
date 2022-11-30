import {dailyClimate2013} from '../../data/dailyClimate2013'
import {dailyClimate2014} from '../../data/dailyClimate2014'
import {dailyClimate2015} from '../../data/dailyClimate2015'
import {dailyClimate2016} from '../../data/dailyClimate2016'
import {dailyClimate} from '../../data/dailyClimate'

import {getRandomNumber} from '../../utils/random'
import {createFluxForGraphsFromDomain} from '../../utils/mapCSVtoFlux'
import {DateRangeOptions} from '../../types'

const MIN_WAIT = 200
const MAX_WAIT = 1500

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
    }, getRandomNumber(MIN_WAIT, MAX_WAIT))
  })
}

export const requeryClimatData = async (domain: number[]) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(createFluxForGraphsFromDomain(domain))
    }, getRandomNumber(MIN_WAIT, MAX_WAIT))
  })
}
