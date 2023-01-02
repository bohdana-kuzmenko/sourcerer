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
                {headers: {Authorization: "Bearer " + window.localStorage.getItem('sourcer_token')}}
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
            {headers: {Authorization: "Bearer " + window.localStorage.getItem('sourcer_token')}}
        ).then((data) => {
            console.log(data)
        }).catch(() => {
            dispatch({type: GET_REGISTERED_CREDENTIALS_FAILED})
        });


        // dispatch({type: GET_KEY_PREVIEW_START})
        // const url = `http://127.0.0.1:8000/api/v1/registrations`
        // const request = new XMLHttpRequest();
        // request.open('POST', url, false);  // `false` makes the request synchronous
        // request.send(credentials);
        // let result = request.responseText
        // dispatch({type: GET_KEY_PREVIEW_SUCCESS})
        // return result
    };

}