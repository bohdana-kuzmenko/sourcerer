import {useDispatch} from "react-redux";
import {USER_AUTHORISE_FAILED, USER_AUTHORISE_START, USER_AUTHORISE_SUCCESS} from "../redux/actions/auth";
import {client} from "./client";
import {
    GET_REGISTERED_CREDENTIALS_FAILED,
    GET_REGISTERED_CREDENTIALS_START,
    GET_REGISTERED_CREDENTIALS_SUCCESS
} from "../redux/actions/registered-credentials";
import {GET_KEY_PREVIEW_START, GET_KEY_PREVIEW_SUCCESS, STORAGES_SHOULD_UPDATE} from "../redux/actions/storage";

export class SettingsApi {
    getRegistrations = (dispatch: any, loading: boolean) => {
        if (!loading) {
            dispatch({type: GET_REGISTERED_CREDENTIALS_START})
            client.get("/api/v1/registrations",
            ).then((data) => {
                dispatch({
                    type: GET_REGISTERED_CREDENTIALS_SUCCESS,
                    payload: {
                        items: data,
                    }
                })
            }).catch((data) => {
                dispatch({
                    type: GET_REGISTERED_CREDENTIALS_FAILED,
                    payload: {
                        error: data
                    }
                })
            });
        }
        ;
    }

    addRegistration = async (dispatch: any, credentials: any) => {
        await client.post("/api/v1/registrations",
            credentials,
        ).then((data) => {

        }).catch(() => {
            dispatch({type: GET_REGISTERED_CREDENTIALS_FAILED})
        });
    };

    activateRegistration = async (dispatch: any, id: any) => {
        await client.get(`/api/v1/registrations/${ id }/activate`,
        ).then((data) => {
            dispatch({type: STORAGES_SHOULD_UPDATE})
        }).catch(() => {
            dispatch({type: GET_REGISTERED_CREDENTIALS_FAILED})
        });
    };
    deactivateRegistration = async (dispatch: any, id: any) => {
        await client.get(`/api/v1/registrations/${ id }/deactivate`,
        ).then((data) => {
            dispatch({type: STORAGES_SHOULD_UPDATE})
        }).catch(() => {
            dispatch({type: GET_REGISTERED_CREDENTIALS_FAILED})
        });
    };

}
