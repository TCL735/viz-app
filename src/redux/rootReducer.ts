import {combineReducers} from 'redux'
import {cellsReducer} from '../components/cells/reducers'

export const rootReducer = combineReducers({cells: cellsReducer})
