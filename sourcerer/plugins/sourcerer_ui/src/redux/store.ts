import {createStore} from '@reduxjs/toolkit'
import rootReducer from "./reducers";

// import todosReducer from './features/todos/todosSlice'
// import filtersReducer from './features/filters/filtersSlice'

const store = createStore(rootReducer)
export default store