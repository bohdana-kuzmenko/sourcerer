import {
    GET_REGISTERED_CREDENTIALS_SUCCESS,
    GET_REGISTERED_CREDENTIALS_START,
    GET_REGISTERED_CREDENTIALS_FAILED,
    CLEAN_SETTINGS_ERROR
} from "../actions/registered-credentials";

export const initialState = {
    items: [],
    loading: false,
    shouldLoadCredentials: true,
    error: undefined

}
export default function registeredCredentialsReducer(state = initialState, action: any) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
        case GET_REGISTERED_CREDENTIALS_START: {
            return {
                ...state,
                loading: true,
                error: undefined,
            }
        }
        case CLEAN_SETTINGS_ERROR: {
            return {
                ...state,
                error: undefined
            }
        }
        case GET_REGISTERED_CREDENTIALS_SUCCESS: {
            return {
                ...state,
                loading: false,
                items: action.payload.items,
                shouldLoadCredentials: false,
            }
        }
        case GET_REGISTERED_CREDENTIALS_FAILED: {
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                shouldLoadCredentials: false,
            }
        }
        default:
            return state
    }
}