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

const selectStorages = (state: any) => state.storages


const PageLoader = () => {
    return (
        <Grid verticalAlign='middle' style={ {height: '100%'} }>
            <Grid.Column>
                <Loader active size='massive' inline='centered'/>
            </Grid.Column>
        </Grid>
    )
}

export default function StoragesPage() {
    const dispatch = useDispatch();
    let storages = useSelector(selectStorages);
    let storagesList = storages.sortedItems;
    let noItemsReceived = storages.noItemsReceived;
    let path = storages.path;
    let storageContent = storages.activeStorageContent;
    let storagePermissions = storages.activeStoragePermissions;
    let keyPreviewLoading = storages.keyPreviewLoading;
    const storagesApi = new StoragesApi()

    let [activeStorage, setActiveStorage] = useState("");
    let [searchString, setSearchString] = useState("");
    let [activeSearchString, setActiveSearchString] = useState(false);
    let [registrationId, setRegistrationId] = useState("");

    const selectStorage = (storage: any) => {
        setSearchString("")
        setActiveSearchString(false)
        setActiveStorage(storage['storage'])
        setRegistrationId(storage['registration_id'])
        storagesApi.getStorageContent(dispatch, storage['registration_id'], storage['storage'], '')
        storagesApi.getStoragePermissions(dispatch, storage['registration_id'], storage['storage'])
    }
    const selectFolder = (folder: any) => {
        if (path.length > 0) {
            folder = path + folder;
        }
        setSearchString("")
        setActiveSearchString(false)
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


    if (storages.shouldUpdate) {
        setActiveStorage("")
        storagesApi.listStorages(dispatch, storages);
    } else {
        if (activeStorage === "" && storagesList.length > 0) {
            selectStorage(storagesList[0].names[0])
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
                            />
                    }
                </Grid.Column>
            </Grid>
        </>
    );
}

