import {Divider} from "semantic-ui-react";
import React from "react";

interface StoragesListParams {
    storages: Array<any>;
    activeStorage: string;
    onStorageSelect: Function;
}

export const StoragesList = (props: StoragesListParams) => {
    return (
        <>
            {
                props.storages.map((group: any, groupIndex: number) => {
                    let groups = group['names'].map((storage: any, storageIndex: number) => {
                            let className = storage['storage'] === props.activeStorage ? "active" : "";
                            return (
                                <p key={storage['storage']} className={'storage-name ' + className}
                                   onClick={() => props.onStorageSelect(storage)}>
                                    {storage['storage']}
                                </p>
                            )
                        }
                    )
                    return [<Divider key={group['letter']}
                                     horizontal>{group['letter']}</Divider>, ...groups]
                })
            }
        </>
    )
}