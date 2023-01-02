import {
    GET_REGISTERED_CREDENTIALS_SUCCESS,
    GET_REGISTERED_CREDENTIALS_START,
    GET_REGISTERED_CREDENTIALS_FAILED
} from "../actions/registered-credentials";

export const initialState = {
    items: [],
    loading: false,

}
export default function registeredCredentialsReducer(state = initialState, action: any) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
        case GET_REGISTERED_CREDENTIALS_START: {
            return {
                ...state,
                loading: true,
            }
        }
        case GET_REGISTERED_CREDENTIALS_SUCCESS: {
            return {
                ...state,
                loading: false,
                items: action.payload.items,
            }
        }
        case GET_REGISTERED_CREDENTIALS_FAILED: {
            return {
                ...state,
                loading: false,
            }
        }
        default:
            return state
    }
}