import {useDispatch} from "react-redux";
import {USER_AUTHORISE_FAILED, USER_AUTHORISE_START, USER_AUTHORISE_SUCCESS} from "../redux/actions/auth";
import {client} from "./client";
import {
    GET_REGISTERED_CREDENTIALS_FAILED,
    GET_REGISTERED_CREDENTIALS_START,
    GET_REGISTERED_CREDENTIALS_SUCCESS
} from "../redux/actions/registered-credentials";
import {GET_KEY_PREVIEW_START, GET_KEY_PREVIEW_SUCCESS} from "../redux/actions/storage";

export class SettingsApi {
    getRegistrations = (dispatch: any, loading: boolean) => {
        if (!loading) {
            dispatch({type: GET_REGISTERED_CREDENTIALS_START})
            client.get("http://127.0.0.1:8000/api/v1/registrations",
            ).then((data) => {
                dispatch({
                    type: GET_REGISTERED_CREDENTIALS_SUCCESS,
                    payload: {
                        items: data,
                    }
                })
            }).catch(() => {
                dispatch({type: GET_REGISTERED_CREDENTIALS_FAILED})
            });
        }
        ;
    }

    addRegistration = async (dispatch: any, credentials: any) => {

        await client.post("http://127.0.0.1:8000/api/v1/registrations",
            credentials,
        ).then((data) => {
            console.log(data)
        }).catch(() => {
            dispatch({type: GET_REGISTERED_CREDENTIALS_FAILED})
        });

    };

}