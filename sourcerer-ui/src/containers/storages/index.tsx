import {useDispatch, useSelector} from "react-redux";
import {
    Accordion,
    Breadcrumb, Button,
    Container,
    Divider,
    Dropdown,
    Grid,
    Image,
    Icon,
    Menu, Modal,
    Table, Loader, Segment
} from "semantic-ui-react";
import {AuthStatus} from "../auth/utils";
import React, {useState} from "react";
import './index.css';
import {StoragesApi} from "../../api/storages-api";

const selectStorages = (state: any) => state.storages

const StorageContent = (props: any) => {
    let [activeMetadata, setActiveMetadata] = useState(false);
    const [open, setOpen] = React.useState(false)
    const [previewContent, setPreviewContent] = React.useState("")
    const [previewContentType, setPreviewContentType] = React.useState("")

    const onPreviewOpen = (key: string) => {
        const images = ['jpg', 'jpeg', 'png']

        let extension = key.split('.').slice(-1)[0].toLowerCase()
        if (images.indexOf(extension) > -1) {
            setOpen(true)
            let link = props.previewContent(key, true)
            setPreviewContent(link);
            setPreviewContentType("image")
        } else {
            if (extension.includes('json')) {
                setOpen(true)
                let link = JSON.parse(props.previewContent(key))
                setPreviewContent(link)
                setPreviewContentType("json")
            }
        }


    }
    const handleClick = (e: any, titleProps: any) => {
        setActiveMetadata(!activeMetadata)
    }

    let path = props.path
    let files = props.files
    let storage = props.storage
    let folders = props.folders
    let permissions = props.permissions
    let onFolderSelect = props.onFolderSelect
    let onDownloadKey = props.onDownloadKey
    let keyPreviewLoading = props.keyPreviewLoading


    let changePath = (event: any, pathIndex: number) => {
        props.onPathClick(pathIndex)
        event.stopPropagation();
    }

    return (
        <>
            <Accordion>
                <Accordion.Title
                    active={activeMetadata}
                    onClick={handleClick}>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Breadcrumb>
                                    <Breadcrumb.Section link onClick={(e) => changePath(e, -1)}>
                                        {storage}
                                    </Breadcrumb.Section>
                                    <Breadcrumb.Divider/>
                                    {
                                        path.split('/').map((folder: any, index: number) => {
                                            return (
                                                <>
                                                    <Breadcrumb.Section
                                                        onClick={(e) => changePath(e, index)}
                                                        key={folder + 'key'}
                                                        link>{folder}</Breadcrumb.Section>
                                                    {index !== path.split('/').length - 1 &&
                                                        <Breadcrumb.Divider key={folder + 'brcr'}/>}
                                                </>
                                            )
                                        })
                                    }
                                </Breadcrumb>
                            </Grid.Column>
                            <Grid.Column textAlign='right'> <Icon name='caret down'/></Grid.Column>
                        </Grid.Row>
                    </Grid>

                </Accordion.Title>
                <Accordion.Content active={activeMetadata}>
                    <Table color={'yellow'} size='small'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan='4'>Permissions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Header>
                            <Table.HeaderCell>User</Table.HeaderCell>
                            <Table.HeaderCell>Full Controll</Table.HeaderCell>
                            <Table.HeaderCell>Read</Table.HeaderCell>
                            <Table.HeaderCell>Write</Table.HeaderCell>
                        </Table.Header>
                        <Table.Body>
                            {
                                Object.keys(permissions).map((user: string) => {
                                    return (
                                        <Table.Row>
                                            <Table.Cell>{user}</Table.Cell>
                                            <Table.Cell>{permissions[user].indexOf('FULL_CONTROL') !== -1 &&
                                                <Icon color='yellow' name='checkmark' size='large'/>}</Table.Cell>
                                            <Table.Cell>{permissions[user].indexOf('READ') !== -1 &&
                                                <Icon color='yellow' name='checkmark' size='large'/>}</Table.Cell>
                                            <Table.Cell>{permissions[user].indexOf('WRITE') !== -1 &&
                                                <Icon color='yellow' name='checkmark' size='large'/>}</Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table>
                </Accordion.Content>
            </Accordion>

            <Table selectable padded basic='very'>
                <Table.Body>
                    {
                        folders.map((folder: any) => {
                            return (
                                <Table.Row className={'folder-name'} key={folder}
                                           onClick={() => onFolderSelect(folder)}>
                                    <Table.Cell colSpan='4' collapsing><Icon name='folder'/> {folder}</Table.Cell>
                                </Table.Row>
                            )
                        })
                    } {
                    files.map((file: any) => {
                        return (
                            <Table.Row className={'file-row'} key={file.key}
                                       onDoubleClick={() => onPreviewOpen(file.key)}>
                                <Table.Cell collapsing><Icon name='file outline'/> {file.key}</Table.Cell>
                                <Table.Cell collapsing>{file.date_modified}</Table.Cell>
                                <Table.Cell collapsing>{file.size}</Table.Cell>
                                <Table.Cell collapsing>
                                    <Dropdown closeOnBlur item pointing={"top right"} icon='ellipsis vertical'>
                                        <Dropdown.Menu>
                                            {/*<ModalExampleContentImage open={open} previewContent={previewContent}>*/}
                                            <Dropdown.Item
                                                onClick={() => onPreviewOpen(file.key)}>Preview
                                            </Dropdown.Item>
                                            {/*</ModalExampleContentImage>*/}
                                            <Dropdown.Item
                                                onClick={() => onDownloadKey(file.key)}>Download</Dropdown.Item>
                                            <Dropdown.Item>Share</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
                </Table.Body>
            </Table>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
            >
                <Modal.Header>Preview {previewContentType}</Modal.Header>
                <Modal.Content image={!keyPreviewLoading && previewContentType === 'image'}>
                    {!keyPreviewLoading && previewContentType === 'image' && (
                        <Image src={previewContent}/>
                    )}
                    {!keyPreviewLoading && previewContentType === 'json' && (
                        <Segment>
                            {previewContent}
                        </Segment>
                    )}
                    {keyPreviewLoading && (
                        <Segment>
                            Loading...
                        </Segment>)
                    }
                </Modal.Content>
            </Modal>
        </>
    )
}


export default function StoragesPage() {
    const dispatch = useDispatch();
    let storages = useSelector(selectStorages);
    let storagesList = storages.sortedItems;
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


    if (storagesList.length === 0) {
        storagesApi.listStorages(dispatch, storages);
    } else {
        if (activeStorage === "") {
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
            <Grid columns={2} style={{height: '100%', padding: '14px', paddingTop: '70px'}}>
                <Grid.Column width={2} style={{height: '100%', overflowY: 'scroll'}}>
                    {
                        storagesList.map((group: any, groupIndex: number) => {
                            let groups = group['names'].map((storage: any, storageIndex: number) => {
                                    let className = storage['storage'] === activeStorage ? "storage-name active" : "storage-name";
                                    return (
                                        <p key={storage['storage']} className={className}
                                           onClick={() => selectStorage(storage)}>
                                            {storage['storage']}
                                        </p>
                                    )
                                }
                            )
                            return [<Divider key={group['letter']}
                                             horizontal>{group['letter']}</Divider>, ...groups]
                        })
                    }
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

