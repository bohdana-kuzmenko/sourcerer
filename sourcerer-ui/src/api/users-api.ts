import {useDispatch} from "react-redux";
import {USER_AUTHORISE_FAILED, USER_AUTHORISE_START, USER_AUTHORISE_SUCCESS} from "../redux/actions/auth";
import {client} from "./client";
import {STORAGES_SHOULD_UPDATE} from "../redux/actions/storage";
import {CREDENTIALS_SHOULD_UPDATE} from "../redux/actions/registered-credentials";

export class UsersApi {
    getCurrentUser = (dispatch: any, user: any) => {
        if (!user.loading) {
            dispatch({type: USER_AUTHORISE_START})
            client.get("http://127.0.0.1:8010/api/v1/auth/me"
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
        }
        ;
    }

    login = (dispatch: any, username: string, password: string, callback: VoidFunction) => {
        dispatch({type: USER_AUTHORISE_START})
        client.post("http://127.0.0.1:8010/api/v1/auth/login",
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
            dispatch({
                type: STORAGES_SHOULD_UPDATE,
            })
            dispatch({
                type: CREDENTIALS_SHOULD_UPDATE,
            })
            callback();
        }).catch(() => {
            dispatch({type: USER_AUTHORISE_FAILED})
        });
    }
    signin = (dispatch: any, firstName: string, lastName: string, email: string, password: string, callback: VoidFunction) => {
        dispatch({type: USER_AUTHORISE_START})
        client.post("http://127.0.0.1:8010/api/v1/auth/signin",
            {email: email, password: password, first_name: firstName, last_name: lastName}
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