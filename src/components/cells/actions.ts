import {Cell} from '../../types'

export const ADD_CELL = 'ADD_CELL'
export const DELETE_CELL = 'DELETE_CELL'
export const SET_CELL_POSITION = 'SET_CELL_POSITION'

export type Action =
  | ReturnType<typeof addCell>
  | ReturnType<typeof deleteCell>
  | ReturnType<typeof setCellPosition>

export const addCell = (cell: Cell) =>
  ({
    type: ADD_CELL,
    payload: cell,
  } as const)

export const deleteCell = (id: string) =>
  ({
    type: DELETE_CELL,
    payload: id,
  } as const)

export const setCellPosition = (cell: Cell) =>
  ({
    type: SET_CELL_POSITION,
    payload: cell,
  } as const)
