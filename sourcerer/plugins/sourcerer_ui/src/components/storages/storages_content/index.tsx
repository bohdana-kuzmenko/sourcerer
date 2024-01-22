import {
    Accordion,
    Breadcrumb,
    Dropdown,
    Grid,
    Icon,
    Image,
    Modal,
    Segment,
    Table,
    Input, GridRow, GridColumn, Button
} from "semantic-ui-react";
import React, {useEffect, useRef, useState} from "react";
import {StoragePermissions} from "../storages_permissions";
import {MIME_TYPES} from "../../../constants";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';



export const StorageContent = (props: any) => {
    let [activeMetadata, setActiveMetadata] = useState(false);
    const [open, setOpen] = React.useState(false)
    const [previewKey, setPreviewKey] = React.useState("")
    const [previewContent, setPreviewContent] = React.useState("")
    const [previewContentType, setPreviewContentType] = React.useState("")
    
    const searchRef = useRef(null);


    let path = props.path
    let files = props.files
    let storage = props.storage
    let folders = props.folders
    let permissions = props.permissions
    let onFolderSelect = props.onFolderSelect
    let onDownloadKey = props.onDownloadKey
    let searchString = props.searchString
    let activeSearchString = props.activeSearchString
    let onSearchInput = props.onSearchInput
    let onDeleteKey = props.onDeleteKey
    let keyPreviewLoading = props.keyPreviewLoading
    let uploadFile = props.uploadFile

    const onPreviewOpen = (key: string) => {
        const images = ['jpg', 'jpeg', 'png']

        let extension = key.split('.').slice(-1)[0].toLowerCase()
        // @ts-ignore
        let mime_type = MIME_TYPES[extension]

        console.log(extension)
        console.log(mime_type)
        if (mime_type.includes('image')) {
            setOpen(true)
            let link = props.previewContent(key, true)
            setPreviewKey(key);
            setPreviewContent(link);
            setPreviewContentType("image")
        }
        if (mime_type.includes('json')) {
            setOpen(true)
            let link = JSON.parse(props.previewContent(key))
            setPreviewKey(key);
            setPreviewContent(link)
            setPreviewContentType("json")
        }
        if (mime_type.includes('xml')) {
            setOpen(true)
            let link = JSON.parse(props.previewContent(key))
            setPreviewKey(key);
            setPreviewContent(link)
            setPreviewContentType("xml")
        }
        if (mime_type.includes('text')) {
            setOpen(true)
            let link = JSON.parse(props.previewContent(key))
            setPreviewKey(key);
            setPreviewContent(link)
            setPreviewContentType("text")
        }
        if (mime_type.includes('yaml')) {
            setOpen(true)
            let link = JSON.parse(props.previewContent(key))
            setPreviewKey(key);
            setPreviewContent(link)
            setPreviewContentType("yaml")
        }
        if (mime_type.includes('audio')) {
            setOpen(true)
            let link = props.previewContent(key, true)
            setPreviewKey(key);
            setPreviewContent(link)
            setPreviewContentType("audio")
        }
    }
    const handleClick = (e: any, titleProps: any) => {
        setActiveMetadata(!activeMetadata)
    }
    
     useEffect(() => {
         if (activeSearchString) {
             // @ts-ignore
             searchRef.current.focus()
         }
      });

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
            
            <Grid columns={2}>
            <GridRow>
                <GridColumn width={15}>
                     <Input 
                         ref={searchRef}
                         placeholder='Search...' 
                         focus={activeSearchString}
                         fluid 
                         icon='search'  
                         value={searchString} 
                         onChange={(e: any) => onSearchInput(e.target.value) }
                     />
                </GridColumn>
                <GridColumn width={1}>
                    <Button as="label" htmlFor="file" type="button" basic icon='upload'/>
                    <input type="file" id="file" style={{ display: "none" }} onChange={uploadFile} />
                </GridColumn>
            </GridRow>  
                </Grid>

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
                <Modal.Header>Preview { previewKey}</Modal.Header>
                <Modal.Content image={ !keyPreviewLoading && previewContentType === 'image' }>
                    { !keyPreviewLoading && previewContentType === 'image' && (
                        <Image src={ previewContent }/>
                    ) }
                    { !keyPreviewLoading && previewContentType === 'json' && (
                        <Segment>
                            <SyntaxHighlighter language="json" style={tomorrow}>
                                {previewContent}
                            </SyntaxHighlighter>
                        </Segment>
                    ) }
                    { !keyPreviewLoading && previewContentType === 'xml' && (
                        <Segment>
                            <SyntaxHighlighter language="xml" style={tomorrow}>
                                {previewContent}
                            </SyntaxHighlighter>
                        </Segment>
                    ) }
                    { !keyPreviewLoading && previewContentType === 'text' && (
                        <Segment>
                            { previewContent }
                        </Segment>
                    ) }
                    { !keyPreviewLoading && previewContentType === 'yaml' && (
                        <Segment>
                             <SyntaxHighlighter language="yaml" style={tomorrow}>
                                {previewContent}
                              </SyntaxHighlighter>
                        </Segment>
                    ) }
                    { !keyPreviewLoading && previewContentType === 'audio' && (
                        <Segment>
                            <audio  style={{width: '100%'}} controls src={previewContent} />
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
