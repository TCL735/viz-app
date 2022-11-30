import {produce} from 'immer'
import {Action, ADD_CELL, DELETE_CELL, SET_CELL_POSITION} from './actions'
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
) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case ADD_CELL: {
        draftState.byIds.push(action.payload.id)
        draftState.allIds[action.payload.id] = action.payload

        return
      }

      case DELETE_CELL: {
        draftState.byIds = draftState.byIds.filter(
          (id) => id !== action.payload
        )
        delete draftState.allIds[action.payload]

        return
      }

      case SET_CELL_POSITION: {
        if (draftState.allIds[action.payload.id]) {
          draftState.allIds[action.payload.id].x = action.payload.x
          draftState.allIds[action.payload.id].y = action.payload.y
          draftState.allIds[action.payload.id].w = action.payload.w
          draftState.allIds[action.payload.id].h = action.payload.h
          draftState.allIds[action.payload.id].minW = action.payload.minW
          draftState.allIds[action.payload.id].minH = action.payload.minH
        }
        return
      }
    }
  })
