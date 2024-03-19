import {
    GET_REGISTERED_STORAGES_SUCCESS,
    GET_REGISTERED_STORAGES_START,
    GET_REGISTERED_STORAGES_FAILED,
    STORAGES_SHOULD_UPDATE
} from "../actions/registered_storages";

export const initialState = {
    items: [],
    loading: false,
    shouldLoadStorages: true,
    error: undefined

}
export default function registeredStoragesReducer(state = initialState, action: any) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
        case GET_REGISTERED_STORAGES_START: {
            return {
                ...state,
                loading: true,
                error: undefined,
                shouldLoadStorages: false
            }
        }

        case STORAGES_SHOULD_UPDATE: {
            return {
                ...state,
                shouldLoadStorages: true
            }
        }
        case GET_REGISTERED_STORAGES_SUCCESS: {
            return {
                ...state,
                loading: false,
                items: action.payload.items,
                shouldLoadStorages: false,
            }
        }
        case GET_REGISTERED_STORAGES_FAILED: {
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                shouldLoadStorages: false,
            }
        }
        default:
            return state
    }
}