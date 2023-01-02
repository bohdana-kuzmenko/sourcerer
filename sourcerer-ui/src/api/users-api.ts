import {useDispatch} from "react-redux";
import {USER_AUTHORISE_FAILED, USER_AUTHORISE_START, USER_AUTHORISE_SUCCESS} from "../redux/actions/auth";
import {client} from "./client";

export class UsersApi {
    getCurrentUser = (dispatch: any, user: any) => {
        if (!user.loading) {
            dispatch({type: USER_AUTHORISE_START})
            client.get("http://127.0.0.1:8000/api/v1/auth/me",
                {headers: {Authorization: "Bearer " + window.localStorage.getItem('sourcer_token')}}
            ).then((data) => {
                dispatch({
                    type: USER_AUTHORISE_SUCCESS,
                    payload: {
                        email: data.email,
                        username: data.user,
                        token: data.access_token,
                    }
                })
            }).catch(() => {
                dispatch({type: USER_AUTHORISE_FAILED})
            });
        };
    }

    login = (dispatch: any, username: string, password: string, callback: VoidFunction) => {
        dispatch({type: USER_AUTHORISE_START})
        client.post("http://127.0.0.1:8000/api/v1/auth/login",
            {username: username, password: password}
        ).then((data) => {
            window.localStorage.setItem("sourcer_token", data.access_token)
            dispatch({
                type: USER_AUTHORISE_SUCCESS,
                payload: {
                    email: data.email,
                    username: data.user,
                    token: data.access_token,
                }
            })
            callback();
        }).catch(() => {
            dispatch({type: USER_AUTHORISE_FAILED})
        });
    }
}