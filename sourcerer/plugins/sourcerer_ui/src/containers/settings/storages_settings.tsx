import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {Button, Divider, Form, Icon, Modal, Table} from "semantic-ui-react";
import {SettingsApi} from "../../api/settings-api";
import {AddItemDialogButton, InputField, showError} from "./common";

const selectRegisteredStorages = (state: any) => state.registeredStorages
const selectRegisteredCredentials = (state: any) => state.registeredCredentials

export default function StoragesSettings() {
    const dispatch = useDispatch();
    let registeredStoragesSelector = useSelector(selectRegisteredStorages);
    let registeredCredentialsSelector = useSelector(selectRegisteredCredentials);

    let registeredStorages = registeredStoragesSelector.items;
    let registeredCredentials = registeredCredentialsSelector.items;
    let registeredStoragesLoading = registeredStoragesSelector.loading;
    const settingsApi = new SettingsApi()

    if (registeredStoragesSelector.shouldLoadStorages) {
        settingsApi.listRegisteredStorages(dispatch, registeredStorages);
    }
    if (registeredStoragesSelector.error !== undefined) {
        showError(registeredStorages.error, dispatch)
    }

    const [storageOpen, setStorageOpen] = React.useState(false)
    const [formData, setFormData] = React.useState({})


    let saveStorage = async () => {
        await settingsApi.addRegisteredStorages(dispatch, {
            ...formData,
        })
        settingsApi.listRegisteredStorages(dispatch, registeredStoragesLoading);
    }

    let deleteStorage = async (storage_id: string) => {
        await settingsApi.deleteRegisteredStorages(dispatch, storage_id)
        settingsApi.listRegisteredStorages(dispatch, registeredStoragesLoading);
    }


    let credentialsId2Name: any = {}

    registeredCredentials.forEach((item: any) => {
        // @ts-ignore
        credentialsId2Name[item.id] = item.credentials.split(' ')[0]
    })

    return (
        <>
            <Divider horizontal>Registered Storages</Divider>
            <AddItemDialogButton onClick={setStorageOpen} title={'Add storage'}/>

            <Table columns={ 3 }>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Credentials Account name</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        registeredStorages.map((storage: any) => {
                            return (
                                <Table.Row key={ storage.id + '-id-creds' }>
                                    <Table.Cell width={5}>{ storage.name }</Table.Cell>
                                    <Table.Cell width={6}>{ credentialsId2Name[storage.credentials_id] }</Table.Cell>
                                    <Table.Cell width={1}>
                                        <Icon color='red' name='delete' onClick={()=>deleteStorage(storage.id)}/>
                                    </Table.Cell>
                                </Table.Row>
                        )
                        })
                        }
                        </Table.Body>
                        </Table>

                            <Modal
                                onClose={ () => {
                                    setFormData({})
                                    setStorageOpen(false)
                                } }
                                onOpen={ () => {
                                    setFormData({})
                                    setStorageOpen(true)
                                } }
                                open={ storageOpen }
                            >
                                <Modal.Header>Add storage name</Modal.Header>
                                <Modal.Content>
                                    <Form onSubmit={ () => null } id={ 'credentials-form' }>
                                        <InputField
                                            condition={ true }
                                            onChange={ (event: any) => setFormData({
                                                ...formData,
                                                name: event.target.value,
                                            }) }
                                            label={ "Storage name" }
                                            placeholder={ "Storage Name" }
                                        />
                                        <Form.Select
                                            fluid
                                            label='Credentials Account'
                                            options={ registeredCredentials.map((item: any) => {
                                                let name = item.credentials.split(' ')[0]
                                                return {key: name, text: name, value: item.id}
                                            }) }
                                            placeholder='Provider'
                                            onChange={ (e: any, {value}) => {
                                                setFormData({
                                                ...formData,
                                                credentials_id: value?.toString() || ""
                                            }) 
                                            } }
                                        />

                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={ () => {
                                        setFormData({})
                                        setStorageOpen(false)
                                    } }>Cancel</Button>
                                    <Button onClick={ () => {
                                        saveStorage();
                                        setFormData({})
                                        setStorageOpen(false)
                                    } } positive>
                                        Ok
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                        </>
                        )
                            ;
                        }

