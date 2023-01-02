import {combineReducers} from 'redux'
import authReducer from "./auth";
import registeredCredentialsReducer from "./registred_credentials";
import storagesReducer from "./storages";


const rootReducer = combineReducers({
    user: authReducer,
    registeredCredentials: registeredCredentialsReducer,
    storages: storagesReducer,
})

export default rootReducer