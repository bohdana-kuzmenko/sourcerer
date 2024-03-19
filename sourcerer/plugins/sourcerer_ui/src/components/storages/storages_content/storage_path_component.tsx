import {Breadcrumb} from "semantic-ui-react";
import React from "react";

interface StoragePreviewPathProps {
    storage: string;
    path: string;
    onChangePath: Function;
}


export const StoragePreviewPath = (props: StoragePreviewPathProps) => {
    return (
        <Breadcrumb>
            <Breadcrumb.Section key={ props.storage + '-path-key' } link onClick={ (e) => props.onChangePath(e, -1) }>
                { props.storage }
            </Breadcrumb.Section>
            <Breadcrumb.Divider key={ props.storage + '-brcr-key' }/>
            {
                props.path.split('/').map((folder: any, index: number) => {
                    if (folder.length === 0) { return null }
                    return (
                        <>
                            <Breadcrumb.Section
                                onClick={ (e) => props.onChangePath(e, index) }
                                key={ folder + '-path-key' }
                                link>{ folder }</Breadcrumb.Section>
                            { index !== props.path.split('/').length - 1 &&
                                <Breadcrumb.Divider key={ folder + '-brcr-key' }/> }
                        </>
                    )
                })
            }
        </Breadcrumb>
    )
}