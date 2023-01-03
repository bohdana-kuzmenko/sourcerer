import { Icon, Table } from "semantic-ui-react";
import React from "react";

interface StoragePermissionsParams {
    permissions: Object;
}

export const StoragePermissions = (props: StoragePermissionsParams) => {
    let permissions = props.permissions

    return (
        <Table color={ 'yellow' } size='small'>
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

                        // @ts-ignore
                        let usersPermissions = permissions[user]
                        return (
                            <Table.Row>
                                <Table.Cell>{ user }</Table.Cell>
                                <Table.Cell>{ usersPermissions.indexOf('FULL_CONTROL') !== -1 &&
                                    <Icon color='yellow' name='checkmark' size='large'/> }</Table.Cell>
                                <Table.Cell>{ usersPermissions.indexOf('READ') !== -1 &&
                                    <Icon color='yellow' name='checkmark' size='large'/> }</Table.Cell>
                                <Table.Cell>{ usersPermissions.indexOf('WRITE') !== -1 &&
                                    <Icon color='yellow' name='checkmark' size='large'/> }</Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>
    )
}
