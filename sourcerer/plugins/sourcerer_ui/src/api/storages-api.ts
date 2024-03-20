import {client} from "./client";
import {
    DELETE_KEY_FAILED,
    DELETE_KEY_START,
    DELETE_KEY_SUCCESS,
    GET_KEY_PREVIEW_START,
    GET_KEY_PREVIEW_SUCCESS,
    GET_KEY_UPLOAD_FAILED,
    GET_KEY_UPLOAD_START,
    GET_KEY_UPLOAD_SUCCESS,
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
            client.get("/api/v1/storages"
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
    getStorageContent = (dispatch: any, registrationId: string, storageName: string, path: string, search?: string) => {
        dispatch({type: GET_STORAGES_CONTENT_START})

        let params = {path: path}
        if (search !== undefined) {
            // @ts-ignore
            params['prefix'] = search
        }
        const inlineParams = new URLSearchParams(params);
        client.get(`/api/v1/storages/${ storageName }?registration_id=${ registrationId }&` + inlineParams
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

        client.get(`/api/v1/storages/${ storageName }/permissions?registration_id=${ registrationId }`
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
        const url = `/api/v1/storages/${ storageName }/download_url?registration_id=${ registrationId }&${ params }`
        const request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.setRequestHeader('Authorization', "Bearer " + window.localStorage.getItem('sourcer_token'))
        request.send(null);
        let result = JSON.parse(request.responseText)
        dispatch({type: GET_KEY_PREVIEW_SUCCESS})
        return result
    };
    uploadFile = (dispatch: any, registrationId: string, storageName: string, path: string, key: string, file: any) => {
        dispatch({type: GET_KEY_UPLOAD_START})
        const params = new URLSearchParams({path: path});
        const url = `/api/v1/storages/${ storageName }/upload?registration_id=${ registrationId }&${ params }`
        const request = new XMLHttpRequest();
        request.open('POST', url, false);  // `false` makes the request synchronous
        request.setRequestHeader('Authorization', "Bearer " + window.localStorage.getItem('sourcer_token'))
        request.onload = () => {
            if (request.status === 200) {
                dispatch({type: GET_KEY_UPLOAD_SUCCESS});
                this.getStorageContent(dispatch, registrationId, storageName, path)
            }
        };
        request.onerror = () => {
            dispatch({type: GET_KEY_UPLOAD_FAILED})
        };
        var formData = new FormData();
        formData.append("file", file);
        request.send(formData);
    };
    getKeyContent = (dispatch: any, registrationId: string, storageName: string, path: string) => {
        dispatch({type: GET_KEY_PREVIEW_START})
        const params = new URLSearchParams({path: path});
        const url = `/api/v1/storages/${ storageName }/preview?registration_id=${ registrationId }&${ params }`
        const request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.setRequestHeader('Authorization', "Bearer " + window.localStorage.getItem('sourcer_token'))
        request.send(null);
        let result = request.responseText
        dispatch({type: GET_KEY_PREVIEW_SUCCESS})
        return result
    };
    deleteKey = (dispatch: any, registrationId: string, storageName: string, path: string, key: string) => {
        let self = this
        dispatch({type: DELETE_KEY_START})
        const params = new URLSearchParams({path: path + key});
        client.delete(`/api/v1/storages/${ storageName }?registration_id=${ registrationId }&${ params }`
        ).then((data) => {
            dispatch({
                type: DELETE_KEY_SUCCESS,
                payload: {}
            })
            self.getStorageContent(dispatch, registrationId, storageName, path)

        }).catch((data) => {
            dispatch({
                type: DELETE_KEY_FAILED,
                payload: {
                    error: data
                }
            })
        });

    };

}
