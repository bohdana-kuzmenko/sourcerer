import {USER_AUTHORISE_FAILED, USER_AUTHORISE_START, USER_AUTHORISE_SUCCESS} from "../actions/auth";

export const initialState = {
    authorized: false,
    email: null,
    loading: false,
    username: null,
    token: null,
    failed: false,
}

export default function authReducer(state = initialState, action: any) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
        case USER_AUTHORISE_START: {
            return {
                ...state,
                loading: true,
            }
        }
        case USER_AUTHORISE_SUCCESS: {
            return {
                ...state,
                loading: false,
                authorized: true,
                email: action.payload.email,
                username: action.payload.username,
                token: action.payload.token,
                failed: false,
            }
        }
        case USER_AUTHORISE_FAILED: {
            return {
                ...state,
                loading: false,
                failed: true,
            }
        }
        default:
            return state
    }
}