import {RootState} from '../../redux/store'
import {Cell} from '../../types'

export const getAllCells = (state: RootState): Cell[] => {
  return Object.values(state.cells.allIds)
}
