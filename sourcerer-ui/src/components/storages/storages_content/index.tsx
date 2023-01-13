import {
    Accordion,
    Breadcrumb,
    Dropdown,
    Grid,
    Icon,
    Image,
    Modal,
    Segment,
    Table
} from "semantic-ui-react";
import React, {useState} from "react";
import {StoragePermissions} from "../storages_permissions";

export const StorageContent = (props: any) => {
    let [activeMetadata, setActiveMetadata] = useState(false);
    const [open, setOpen] = React.useState(false)
    const [previewContent, setPreviewContent] = React.useState("")
    const [previewContentType, setPreviewContentType] = React.useState("")

    let path = props.path
    let files = props.files
    let storage = props.storage
    let folders = props.folders
    let permissions = props.permissions
    let onFolderSelect = props.onFolderSelect
    let onDownloadKey = props.onDownloadKey
    let onDeleteKey = props.onDeleteKey
    let keyPreviewLoading = props.keyPreviewLoading

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


    let changePath = (event: any, pathIndex: number) => {
        props.onPathClick(pathIndex)
        event.stopPropagation();
    }

    return (
        <>
            <Accordion>
                <Accordion.Title
                    active={ activeMetadata }
                    onClick={ handleClick }>
                    <Grid>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column>
                                <Breadcrumb>
                                    <Breadcrumb.Section key={storage+'-path-key'} link onClick={ (e) => changePath(e, -1) }>
                                        { storage }
                                    </Breadcrumb.Section>
                                    <Breadcrumb.Divider key={storage+'-brcr-key'}/>
                                    {
                                        path.split('/').map((folder: any, index: number) => {
                                            if (folder.length === 0) {
                                                return null
                                            }
                                            return (
                                                <>
                                                    <Breadcrumb.Section
                                                        onClick={ (e) => changePath(e, index) }
                                                        key={ folder + '-path-key' }
                                                        link>{ folder }</Breadcrumb.Section>
                                                    { index !== path.split('/').length - 1 &&
                                                        <Breadcrumb.Divider key={ folder + '-brcr-key' }/> }
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
                <Accordion.Content active={ activeMetadata }>
                    <StoragePermissions permissions={ permissions }/>
                </Accordion.Content>
            </Accordion>

            <Table selectable padded basic='very'>
                <Table.Body>
                    {
                        folders.map((folder: any) => {
                            return (
                                <Table.Row className={ 'folder-name' } key={ folder + '-storage-content' }
                                           onClick={ () => onFolderSelect(folder) }>
                                    <Table.Cell colSpan='4' collapsing><Icon name='folder'/> { folder }</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }{
                    files.map((file: any) => {
                        return (
                            <Table.Row className={ 'file-row' } key={ file.key }
                                       onDoubleClick={ () => onPreviewOpen(file.key) }>
                                <Table.Cell collapsing><Icon name='file outline'/> { file.key }</Table.Cell>
                                <Table.Cell collapsing>{ file.date_modified }</Table.Cell>
                                <Table.Cell collapsing>{ file.size }</Table.Cell>
                                <Table.Cell collapsing>
                                    <Dropdown closeOnBlur item pointing={ "top right" } icon='ellipsis vertical'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={ () => onDownloadKey(file.key) }>Download
                                            </Dropdown.Item>
                                            <Dropdown.Item>Share</Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={ () => onDeleteKey(file.key) }>Delete
                                            </Dropdown.Item>
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
                open={ open }
                onClose={ () => setOpen(false) }
                onOpen={ () => setOpen(true) }
            >
                <Modal.Header>Preview { previewContentType }</Modal.Header>
                <Modal.Content image={ !keyPreviewLoading && previewContentType === 'image' }>
                    { !keyPreviewLoading && previewContentType === 'image' && (
                        <Image src={ previewContent }/>
                    ) }
                    { !keyPreviewLoading && previewContentType === 'json' && (
                        <Segment>
                            { previewContent }
                        </Segment>
                    ) }
                    { keyPreviewLoading && (
                        <Segment>
                            Loading...
                        </Segment>)
                    }
                </Modal.Content>
            </Modal>
        </>
    )
}