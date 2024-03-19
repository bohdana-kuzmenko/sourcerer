import {useDispatch, useSelector} from "react-redux";
import {Container, Grid, Loader, Menu} from "semantic-ui-react";
import {AuthStatus} from "../auth/utils";
import React, {useState} from "react";
import {StoragesApi} from "../../api/storages-api";
import {NoItemsNotification} from "../../components/storages/no-items-notification";
import {StoragesList} from "../../components/storages/storages_list";
import {StorageContent} from "../../components/storages/storages_content";
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

import './index.css';
import {CLEAN_ERROR} from "../../redux/actions/storage";
import {PageLoader} from "../common/loader";
import {useSearchParams} from "react-router-dom";

const selectStorages = (state: any) => state.storages

export default function StoragesPage() {
    const dispatch = useDispatch();
    let storages = useSelector(selectStorages);
    let storagesRawList = storages.items;
    let storagesList = storages.sortedItems;
    let noItemsReceived = storages.noItemsReceived;
    let path = storages.path;
    let storageContent = storages.activeStorageContent;
    let storagePermissions = storages.activeStoragePermissions;
    let keyPreviewLoading = storages.keyPreviewLoading;
    const storagesApi = new StoragesApi()

    const [searchParams, setSearchParams] = useSearchParams();
    let [activeStorage, setActiveStorage] = useState("");
    let [searchString, setSearchString] = useState("");
    let [activeSearchString, setActiveSearchString] = useState(false);
    let [registrationId, setRegistrationId] = useState("");

    const selectStorage = (storage: any, preserve_path: boolean = false) => {
        setSearchString("")
        setActiveSearchString(false)
        setActiveStorage(storage['storage'])
        setRegistrationId(storage['registration_id'])
        let path = ''
        if (preserve_path){
            searchParams.set('active', storage['storage'])
            setSearchParams(searchParams)   
            path = searchParams.get('path') || ''
        } else {
            setSearchParams({active: storage['storage']})
        }
        storagesApi.getStorageContent(dispatch, storage['registration_id'], storage['storage'], path)
        storagesApi.getStoragePermissions(dispatch, storage['registration_id'], storage['storage'])
    }
    const selectFolder = (folder: any) => {
        if (path.length > 0) {
            folder = path + folder;
        }
        setSearchString("")
        setActiveSearchString(false)
        searchParams.set('path', folder)
        setSearchParams(searchParams)    
        storagesApi.getStorageContent(dispatch, registrationId, activeStorage, folder)
    }
    
    const onSearchInput = (substring: string) => {
        setSearchString(substring)
        setActiveSearchString(true)
        storagesApi.getStorageContent(dispatch, registrationId, activeStorage, path, substring)
    }

    const onPathClick = (pathIndex: number) => {
        let folder = path.split('/').slice(0, pathIndex + 1).join('/')
        if (folder.length > 0) {
            folder += '/'
        }
        setSearchString("")
        setActiveSearchString(false)
        searchParams.set('path', folder)
        setSearchParams(searchParams)    
        storagesApi.getStorageContent(dispatch, registrationId, activeStorage, folder)
    }


    const previewContent = (key: string, presigned: boolean) => {
        if (presigned) {
            return storagesApi.getKeyDownloadUrl(dispatch, registrationId, activeStorage, storages.path + key)
        }
        return storagesApi.getKeyContent(dispatch, registrationId, activeStorage, storages.path + key)

    }
    const downloadKey = (key: string) => {
        let url = storagesApi.getKeyDownloadUrl(dispatch, registrationId, activeStorage, storages.path + key)
        const link = document.createElement('a')
        link.href = url
        link.click()
    }
    const deleteKey = (key: string) => {
        storagesApi.deleteKey(dispatch, registrationId, activeStorage, storages.path,  key)
    }

    const uploadFile = (event: any)=> {
        let file = event.target.files[0]
        storagesApi.uploadFile(dispatch, registrationId, activeStorage,storages.path, file.name, file)
    }

    if (storages.shouldUpdate) {
        setActiveStorage("")
        storagesApi.listStorages(dispatch, storages);
    } else {
        if (activeStorage === "" && storagesList.length > 0) {
            let storageName = searchParams.get('active')
            let selectedStorage = storagesRawList.filter((item:any)=>item.storage === storageName)
            let useSelectedStorage = selectedStorage.length > 0
            selectStorage(useSelectedStorage ? selectedStorage[0]: storagesList[0].names[0], useSelectedStorage)
        }
    }

    if (storages.storagesListIsLoading) {
        return <PageLoader/>
    }
    if (storages.error !== undefined) {
        // @ts-ignore

        toast(
            {
                title: "Error:" + storages.error,
                type: "error",
                time: 5000,
                color: "yellow",
                icon: "exclamation",
                size: "tiny"
            },
            () => dispatch({type: CLEAN_ERROR}),
            () => dispatch({type: CLEAN_ERROR}),
            () => dispatch({type: CLEAN_ERROR})
        );
        dispatch({type: CLEAN_ERROR})
    }


    return (
        <>
            <SemanticToastContainer className={ "customToast" }/>
            <Menu fixed='top' inverted style={ {backgroundColor: '#011627'} }>
                <Container>
                    <Menu.Item as='a'>Home</Menu.Item>
                    <Menu.Item position='right'> <AuthStatus/></Menu.Item>
                </Container>
            </Menu>
            {
                noItemsReceived && <NoItemsNotification/>

            }
            <Grid columns={ 2 } style={ {height: '100%', padding: '14px', paddingTop: '70px'} }>
                <Grid.Column width={ 2 } style={ {height: '100%', overflowY: 'scroll'} }>
                    <StoragesList
                        storages={ storagesList }
                        activeStorage={ activeStorage }
                        onStorageSelect={ selectStorage }
                    />
                </Grid.Column>
                <Grid.Column width={ 14 } style={ {height: '100%', overflowY: 'scroll'} }>
                    {
                        storages.storagesContentIsLoading
                            ? <PageLoader/>
                            : <StorageContent
                                onFolderSelect={ selectFolder }
                                onDownloadKey={ downloadKey }
                                onDeleteKey={ deleteKey }
                                previewContent={ previewContent }
                                onPathClick={ onPathClick }
                                permissions={ storagePermissions }
                                storage={ activeStorage }
                                folders={ storageContent.folders }
                                files={ storageContent.files }
                                path={ path }
                                keyPreviewLoading={ keyPreviewLoading }
                                onSearchInput={ onSearchInput }
                                searchString = { searchString }
                                activeSearchString={ activeSearchString }
                                uploadFile={ uploadFile }
                            />
                    }
                </Grid.Column>
            </Grid>
        </>
    );
}

