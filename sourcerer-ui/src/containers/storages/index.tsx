import {useDispatch, useSelector} from "react-redux";
import { Container, Grid, Menu } from "semantic-ui-react";
import {AuthStatus} from "../auth/utils";
import React, {useState} from "react";
import {StoragesApi} from "../../api/storages-api";
import {NoItemsNotification} from "../../components/storages/no-items-notification";
import {StoragesList} from "../../components/storages/storages_list";
import {StorageContent} from "../../components/storages/storages_content";
import './index.css';

const selectStorages = (state: any) => state.storages

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
    let [registrationId, setRegistrationId] = useState("");

    const selectStorage = (storage: any) => {
        setActiveStorage(storage['storage'])
        setRegistrationId(storage['registration_id'])
        storagesApi.getStorageContent(dispatch, storage['registration_id'], storage['storage'], '')
        storagesApi.getStoragePermissions(dispatch, storage['registration_id'], storage['storage'])
    }
    const selectFolder = (folder: any) => {
        if (path.length > 0) {
            folder = path + folder;
        }
        storagesApi.getStorageContent(dispatch, registrationId, activeStorage, folder)
    }

    const onPathClick = (pathIndex: number) => {
        let folder = path.split('/').slice(0, pathIndex + 1).join('/')
        if (folder.length > 0) {
            folder += '/'
        }
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


    if (storages.shouldUpdate) {
        storagesApi.listStorages(dispatch, storages);
    } else {
        if (activeStorage === "" && storagesList.length > 0) {
            selectStorage(storagesList[0].names[0])
        }
    }


    return (
        <>
            <Menu fixed='top' inverted style={{backgroundColor: '#011627'}}>
                <Container>
                    <Menu.Item as='a'>Home</Menu.Item>
                    <Menu.Item position='right'> <AuthStatus/></Menu.Item>
                </Container>
            </Menu>
            {
                noItemsReceived && <NoItemsNotification/>

            }
            <Grid columns={2} style={{height: '100%', padding: '14px', paddingTop: '70px'}}>
                <Grid.Column width={2} style={{height: '100%', overflowY: 'scroll'}}>
                    <StoragesList
                        storages={storagesList}
                        activeStorage={activeStorage}
                        onStorageSelect={selectStorage}
                    />
                </Grid.Column>
                <Grid.Column width={14} style={{height: '100%', overflowY: 'scroll'}}>
                    <StorageContent
                        onFolderSelect={selectFolder}
                        onDownloadKey={downloadKey}
                        previewContent={previewContent}
                        onPathClick={onPathClick}
                        permissions={storagePermissions}
                        storage={activeStorage}
                        folders={storageContent.folders}
                        files={storageContent.files}
                        path={path}
                        keyPreviewLoading={keyPreviewLoading}
                    />
                </Grid.Column>
            </Grid>
        </>
    );
}

