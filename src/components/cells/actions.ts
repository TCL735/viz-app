import {Cell} from '../../types'

export const ADD_CELL = 'ADD_CELL'
export const DELETE_CELL = 'DELETE_CELL'

export type Action = ReturnType<typeof addCell> | ReturnType<typeof deleteCell>

export const addCell = (cell: Cell) =>
  ({
    type: ADD_CELL,
    payload: cell,
  } as const)

export const deleteCell = (cell: Cell) =>
  ({
    type: DELETE_CELL,
    payload: cell,
  } as const)
