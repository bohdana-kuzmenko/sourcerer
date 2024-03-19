import {
    Accordion,
    Dropdown,
    Grid,
    Icon,
    Table,
    Input, GridRow, GridColumn, Button
} from "semantic-ui-react";
import React, {useEffect, useRef, useState} from "react";
import {StoragePermissions} from "../storages_permissions";
import {MIME_TYPES} from "../../../constants";
import {PreviewModalContent} from "./preview_modal";
import {StoragePreviewPath} from "./storage_path_component";



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

    const preview = (key: string, parse_json_content: boolean, presigned: boolean, content_type: string) => {
        setOpen(true);
        setPreviewKey(key);
        let content = presigned ? props.previewContent(key, true): props.previewContent(key)
        if (parse_json_content){
            content = JSON.parse(content)
        }
        setPreviewKey(key);
        setPreviewContent(content)
        setPreviewContentType(content_type)
    }
    const onPreviewOpen = (key: string) => {
        let extension = key.split('.').slice(-1)[0].toLowerCase()
        // @ts-ignore
        let mime_type = MIME_TYPES[extension]
        if (mime_type.includes('image')) {
            preview(key,false,true, 'image')
        }
        if (mime_type.includes('json')) {
            preview(key,true,false, 'json')
        }
        if (mime_type.includes('xml')) {
            preview(key,true,false, 'xml')
        }
        if (mime_type.includes('text')) {
            preview(key,true,false, 'text')
        }
        if (mime_type.includes('yaml')) {
            preview(key,true,false, 'yaml')
        }
        if (mime_type.includes('audio')) {
            preview(key,false,false, 'audio')
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
                                <StoragePreviewPath storage={storage} path={path} onChangePath={changePath}/>
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
            <PreviewModalContent
                open={open}
                onOpen={()=>setOpen(true)}
                onClose={()=>setOpen(false)}
                previewKey={previewKey}
                keyPreviewLoading={keyPreviewLoading}
                previewContentType={previewContentType}
                previewContent={previewContent}
            />
        </>
    )
}
