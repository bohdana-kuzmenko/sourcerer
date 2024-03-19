import {client} from "./client";
import {
    GET_REGISTERED_CREDENTIALS_FAILED,
    GET_REGISTERED_CREDENTIALS_START,
    GET_REGISTERED_CREDENTIALS_SUCCESS
} from "../redux/actions/registered-credentials";
import {STORAGES_SHOULD_UPDATE} from "../redux/actions/storage";
import {
    ADD_REGISTERED_STORAGE_FAILED,
    ADD_REGISTERED_STORAGE_START,
    DELETE_REGISTERED_STORAGE_FAILED,
    DELETE_REGISTERED_STORAGE_START,
    DELETE_REGISTERED_STORAGE_SUCCESS,
    GET_REGISTERED_STORAGES_FAILED,
    GET_REGISTERED_STORAGES_START,
    GET_REGISTERED_STORAGES_SUCCESS
} from "../redux/actions/registered_storages";

export class SettingsApi {
    getRegistrations = (dispatch: any, loading: boolean) => {
        if (!loading) {
            dispatch({type: GET_REGISTERED_CREDENTIALS_START})
            client.get("/api/v1/registrations/credentials",
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
        await client.post("/api/v1/registrations/credentials",
            credentials,
        ).then((data) => {

        }).catch(() => {
            dispatch({type: GET_REGISTERED_CREDENTIALS_FAILED})
        });
    };

    switchRegistrationActivation = async (dispatch: any, id: any, active: boolean) => {
        let action = active ? 'activate' : 'deactivate';
        await client.get(`/api/v1/registrations/credentials/${ id }/${ action }`,
        ).then((data) => {
            dispatch({type: STORAGES_SHOULD_UPDATE})
        }).catch(() => {
            dispatch({type: GET_REGISTERED_CREDENTIALS_FAILED})
        });
    };
    
    listRegisteredStorages = (dispatch: any, storages: any) => {
        if (!storages.loading) {
            dispatch({type: GET_REGISTERED_STORAGES_START})
            client.get("/api/v1/registrations/storages"
            ).then((data) => {
                dispatch({
                    type: GET_REGISTERED_STORAGES_SUCCESS,
                    payload: {
                        items: data,
                    }
                })
            }).catch((data) => {
                dispatch({
                    type: GET_REGISTERED_STORAGES_FAILED,
                    payload: {
                        error: data
                    }
                })
            });
        }
        ;
    }
    addRegisteredStorages = async (dispatch: any, storage: any) => {
        dispatch({type: ADD_REGISTERED_STORAGE_START})
        await client.post("/api/v1/registrations/storages",
            storage,
        ).then((data) => {
            dispatch({type: ADD_REGISTERED_STORAGE_START})
        }).catch(() => {
            dispatch({type: ADD_REGISTERED_STORAGE_FAILED})
        });
    }
    deleteRegisteredStorages = (dispatch: any, storage_id: any) => {
        dispatch({type: DELETE_REGISTERED_STORAGE_START})
        client.delete(`/api/v1/registrations/storages/${ storage_id }`
        ).then((data) => {
            dispatch({
                type: DELETE_REGISTERED_STORAGE_SUCCESS,
            })
        }).catch((data) => {
            dispatch({
                type: DELETE_REGISTERED_STORAGE_FAILED,
                payload: {
                    error: data
                }
            })
        });
    };
}
