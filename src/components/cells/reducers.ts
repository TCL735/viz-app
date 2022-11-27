import {Action, ADD_CELL, DELETE_CELL} from './actions'
import {Cell} from '../../types'

interface CellsState {
  byIds: string[]
  allIds: {
    [id: string]: Cell
  }
}

const initialState: CellsState = {
  byIds: [],
  allIds: {},
}

export const cellsReducer = (
  state: CellsState = initialState,
  action: Action
) => {
  switch (action.type) {
    case ADD_CELL: {
      return {
        byIds: [...state.byIds, action.payload.id],
        allIds: {
          ...state.allIds,
          [action.payload.id]: action.payload,
        },
      }
    }

    case DELETE_CELL: {
      const {[action.payload.id]: deletedCell, ...remainingCells} = state.allIds
      return {
        byIds: state.byIds.filter((id: string) => id !== action.payload.id),
        allIds: {
          ...remainingCells,
        },
      }
    }

    default:
      return state
  }
}
