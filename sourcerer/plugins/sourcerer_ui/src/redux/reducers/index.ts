import {combineReducers} from 'redux'
import authReducer from "./auth";
import registeredCredentialsReducer from "./registred_credentials";
import storagesReducer from "./storages";
import registeredStoragesReducer from "./registred_storages";


const rootReducer = combineReducers({
    user: authReducer,
    registeredCredentials: registeredCredentialsReducer,
    registeredStorages: registeredStoragesReducer,
    storages: storagesReducer,
})

export default rootReducer