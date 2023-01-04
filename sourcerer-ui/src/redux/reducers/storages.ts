import {
    GET_KEY_PREVIEW_FAILED,
    GET_KEY_PREVIEW_START, GET_KEY_PREVIEW_SUCCESS,
    GET_STORAGES_CONTENT_FAILED,
    GET_STORAGES_CONTENT_START,
    GET_STORAGES_CONTENT_SUCCESS,
    GET_STORAGES_FAILED,
    GET_STORAGES_PERMISSIONS_FAILED,
    GET_STORAGES_PERMISSIONS_START,
    GET_STORAGES_PERMISSIONS_SUCCESS,
    GET_STORAGES_START,
    GET_STORAGES_SUCCESS, STORAGES_SHOULD_UPDATE
} from "../actions/storage";

export const initialState = {
    items: [],
    noItemsReceived: false,
    shouldUpdate: true,
    sortedItems: [],
    storagesListIsLoading: false,
    storagesContentIsLoading: false,
    storagesPermissionsIsLoading: false,
    storagesLoading: false,
    storagesContentLoading: false,
    keyPreviewLoading: false,
    activeStorage: "",
    path: "",
    activeStorageContent: {
        "folders": [],
        "files": []
    },
    activeStoragePermissions: {},
    activeStorageMetadata: {}
}

const groupNames = (arr: any) => {
    const map = arr.reduce((acc: any, val: any) => {
        let char = val['storage'].charAt(0).toUpperCase();
        acc[char] = [].concat((acc[char] || []), val);
        return acc;
    }, {});
    const res = Object.keys(map).map(el => ({
        letter: el,
        names: map[el]
    }));
    return res;
};

function dynamicSort(property:string) {
    let sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a: any,b:any) {
        if(sortOrder === -1){
            return b[property].localeCompare(a[property]);
        }
        return a[property].localeCompare(b[property]);
    }
}

export default function storagesReducer(state = initialState, action: any) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
        case GET_STORAGES_START: {
            return {
                ...state,
                storagesListIsLoading: true,
                shouldUpdate: false,
                items: [],
                sortedItems: {},
            }
        }case STORAGES_SHOULD_UPDATE: {
            return {
                ...state,
                shouldUpdate: true,

            }
        }
        case GET_STORAGES_SUCCESS: {
            return {
                ...state,
                storagesListIsLoading: false,
                items: action.payload.items,
                sortedItems: groupNames(action.payload.items).sort(dynamicSort("letter")),
                noItemsReceived: action.payload.items.length === 0,
            }
        }
        case GET_STORAGES_FAILED: {
            return {
                ...state,
                storagesListIsLoading: false,
            }
        }
        case GET_STORAGES_CONTENT_START: {
            return {
                ...state,
                activeStorageContent: {
                    "folders": [],
                    "files": []
                },
                storagesContentIsLoading: true

            }
        }
        case GET_STORAGES_CONTENT_SUCCESS: {
            return {
                ...state,
                storagesContentIsLoading: false,
                activeStorageContent: action.payload.items,
                path: action.payload.path,
            }
        }
        case GET_STORAGES_CONTENT_FAILED: {
            return {
                ...state,
                storagesContentIsLoading: false,
            }
        }
        case GET_STORAGES_PERMISSIONS_START: {
            return {
                ...state,
                activeStoragePermissions: {},
                storagesPermissionsIsLoading: true

            }
        }
        case GET_STORAGES_PERMISSIONS_SUCCESS: {
            return {
                ...state,
                storagesPermissionsIsLoading: false,
                activeStoragePermissions: action.payload.permissions,

            }
        }
        case GET_STORAGES_PERMISSIONS_FAILED: {
            return {
                ...state,
                storagesPermissionsIsLoading: false,
            }
        }
        case GET_KEY_PREVIEW_START: {
            return {
                ...state,
                keyPreviewLoading: true

            }
        }
        case GET_KEY_PREVIEW_SUCCESS: {
            return {
                ...state,
                keyPreviewLoading: false,
            }
        }
        case GET_KEY_PREVIEW_FAILED: {
            return {
                ...state,
                keyPreviewLoading: false,
            }
        }
        default:
            return state
    }
}