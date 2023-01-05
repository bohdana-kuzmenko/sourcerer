import {useDispatch} from "react-redux";
import {USER_AUTHORISE_FAILED, USER_AUTHORISE_START, USER_AUTHORISE_SUCCESS} from "../redux/actions/auth";
import {client} from "./client";
import {
    GET_KEY_DOWNLOAD_URL_FAILED,
    GET_KEY_DOWNLOAD_URL_START, GET_KEY_DOWNLOAD_URL_SUCCESS, GET_KEY_PREVIEW_START, GET_KEY_PREVIEW_SUCCESS,
    GET_STORAGES_CONTENT_FAILED,
    GET_STORAGES_CONTENT_START,
    GET_STORAGES_CONTENT_SUCCESS,
    GET_STORAGES_FAILED,
    GET_STORAGES_PERMISSIONS_FAILED,
    GET_STORAGES_PERMISSIONS_START,
    GET_STORAGES_PERMISSIONS_SUCCESS,
    GET_STORAGES_START,
    GET_STORAGES_SUCCESS
} from "../redux/actions/storage";

export class StoragesApi {
    listStorages = (dispatch: any, storages: any) => {
        if (!storages.loading) {
            dispatch({type: GET_STORAGES_START})
            client.get("http://127.0.0.1:8000/api/v1/storages"
            ).then((data) => {
                dispatch({
                    type: GET_STORAGES_SUCCESS,
                    payload: {
                        items: data,
                    }
                })
            }).catch((data) => {
                dispatch({
                    type: GET_STORAGES_FAILED,
                    payload: {
                        error: data
                    }
                })
            });
        }
        ;
    }

    getStorageContent = (dispatch: any, registrationId: string, storageName: string, path: string) => {
        dispatch({type: GET_STORAGES_CONTENT_START})

        const params = new URLSearchParams({path: path});
        client.get(`http://127.0.0.1:8000/api/v1/registrations/${ registrationId }/storages/${ storageName }?` + params
        ).then((data) => {
            dispatch({
                type: GET_STORAGES_CONTENT_SUCCESS,
                payload: {
                    items: data,
                    path: path
                }
            })
        }).catch((data) => {
            dispatch({
                type: GET_STORAGES_CONTENT_FAILED,
                payload: {
                    error: data
                }
            })
        });
    };
    getStoragePermissions = (dispatch: any, registrationId: string, storageName: string) => {
        dispatch({type: GET_STORAGES_PERMISSIONS_START})

        client.get(`http://127.0.0.1:8000/api/v1/registrations/${ registrationId }/storages/${ storageName }/permissions`
        ).then((data) => {
            dispatch({
                type: GET_STORAGES_PERMISSIONS_SUCCESS,
                payload: {
                    permissions: data,
                }
            })
        }).catch((data) => {
            dispatch({
                type: GET_STORAGES_PERMISSIONS_FAILED,
                payload: {
                    error: data
                }
            })
        });
    };
    getKeyDownloadUrl = (dispatch: any, registrationId: string, storageName: string, path: string) => {
        dispatch({type: GET_KEY_PREVIEW_START})
        const params = new URLSearchParams({path: path});
        const url = `http://127.0.0.1:8000/api/v1/registrations/${ registrationId }/storages/${ storageName }/download_url?${ params }`
        const request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.setRequestHeader('Authorization', "Bearer " + window.localStorage.getItem('sourcer_token'))
        request.send(null);
        let result = JSON.parse(request.responseText)
        dispatch({type: GET_KEY_PREVIEW_SUCCESS})
        return result
    };

    getKeyContent = (dispatch: any, registrationId: string, storageName: string, path: string) => {
        dispatch({type: GET_KEY_PREVIEW_START})
        const params = new URLSearchParams({path: path});
        const url = `http://127.0.0.1:8000/api/v1/registrations/${ registrationId }/storages/${ storageName }/preview?${ params }`
        const request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.setRequestHeader('Authorization', "Bearer " + window.localStorage.getItem('sourcer_token'))
        request.send(null);
        let result = request.responseText
        dispatch({type: GET_KEY_PREVIEW_SUCCESS})
        return result
    };

}