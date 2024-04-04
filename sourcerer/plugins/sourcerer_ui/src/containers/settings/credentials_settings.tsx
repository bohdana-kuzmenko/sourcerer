import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {Button, Checkbox, Divider, Form, Modal, Table} from "semantic-ui-react";
import {SettingsApi} from "../../api/settings-api";
import {AddItemDialogButton, InputField, showError} from "./common";

const selectRegisteredCredentials = (state: any) => state.registeredCredentials

export default function CredentialsSettings() {
    const dispatch = useDispatch();
    let registeredCredentialsSelector = useSelector(selectRegisteredCredentials);

    let registeredCredentials = registeredCredentialsSelector.items;
    let registeredCredentialsLoading = registeredCredentialsSelector.loading;
    const settingsApi = new SettingsApi()

    if (registeredCredentialsSelector.shouldLoadCredentials) {
        settingsApi.getRegistrations(dispatch, registeredCredentialsLoading);
    }
    if (registeredCredentialsSelector.error !== undefined) {
        showError(registeredCredentialsSelector.error, dispatch)
    }

    const [credentialsOpen, setCredentialsOpen] = React.useState(false)
    const [formData, setFormData] = React.useState({})
    const [provider, setProvider] = React.useState("")
    const options = [
        {key: 'blobby', text: 'Blobby', value: 'BLOBBY'},
        {key: 'mcqueen', text: 'McQueen', value: 'MCQUEEN'},
        {key: 'conductor', text: 'Conductor', value: 'CONDUCTOR'},
    ]

    const S3_COMPATIBLE_BUCKETS = ['BLOBBY', 'MCQUEEN', 'APPLE_S3', 'S3', 'CONDUCTOR']
    let saveCredentials = async () => {
        await settingsApi.addRegistration(dispatch, {
            provider: provider,
            credentials: formData
        })
        settingsApi.getRegistrations(dispatch, registeredCredentialsLoading);
    }
    
    let onActiveChange = async (creds: any) => {
        await settingsApi.switchRegistrationActivation(dispatch, creds.id, !creds.active)
        settingsApi.getRegistrations(dispatch, registeredCredentialsLoading);
    }

    return (
        <>
            <Divider horizontal> Registered Credentials</Divider>
            <AddItemDialogButton onClick={setCredentialsOpen} title={'Add Credentials'}/>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell/>
                        <Table.HeaderCell>Provider</Table.HeaderCell>
                        <Table.HeaderCell>Credentials</Table.HeaderCell>
                        <Table.HeaderCell>Date created</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        registeredCredentials.map((creds: any) => {
                            return (
                                <Table.Row key={ creds.id + '-id-creds' }>
                                    <Table.Cell collapsing>
                                        <Checkbox slider
                                                  checked={ creds.active }
                                                  onChange={ () => onActiveChange(creds) }
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{ creds.provider }</Table.Cell>
                                    <Table.Cell>{ creds.credentials.split(' ')[0] }</Table.Cell>
                                    <Table.Cell>{ creds.created_at }</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
            <Modal
                onClose={ () => {
                    setProvider("")
                    setFormData({})
                    setCredentialsOpen(false)
                } }
                onOpen={ () => {
                    setProvider("")
                    setFormData({})
                    setCredentialsOpen(true)
                } }
                open={ credentialsOpen }
            >
                <Modal.Header>Add sources credentials</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={ () => null } id={ 'credentials-form' }>
                        <Form.Select
                            fluid
                            label='Provider'
                            options={ options }
                            placeholder='Provider'
                            onChange={ (e: any, {value}) => {
                                // @ts-ignore
                                setProvider(value?.toString() || "")
                            } }
                        />
                        {
                            S3_COMPATIBLE_BUCKETS.indexOf(provider) > -1 && (
                                <>
                                    <InputField
                                        onChange={ (event: any) => setFormData({
                                            ...formData,
                                            secret_access_key: event.target.value,
                                        }) }
                                        label={ "AWS Secret Access Key" }
                                        placeholder={ "AWS Secret Access Key" }
                                    />
                                    <InputField
                                        onChange={ (event: any) => setFormData({
                                            ...formData,
                                            access_key: event.target.value,
                                        }) }
                                        label={ "AWS Access Key" }
                                        placeholder={ "AWS Secret Access Key" }
                                    />
                                </>
                            )
                        }
                        
                        <InputField
                            condition={ ["MCQUEEN"].indexOf(provider) > -1 }
                            onChange={ (event: any) => setFormData({
                                ...formData,
                                region: event.target.value,
                            }) }
                            label={ "Region" }
                            placeholder={ "Region" }
                        />
                        
                        <InputField
                            condition={ ["MCQUEEN"].indexOf(provider) > -1 }
                            onChange={ (event: any) => setFormData({
                                ...formData,
                                endpoint_url: event.target.value,
                            }) }
                            label={ "Endpoint Url" }
                            placeholder={ "Endpoint Url" }
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={ () => {
                        setProvider("")
                        setFormData({})
                        setCredentialsOpen(false)
                    } }>Cancel</Button>
                    <Button onClick={ () => {
                        saveCredentials();
                        setProvider("")
                        setFormData({})
                        setCredentialsOpen(false)
                    } } positive>
                        Ok
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}

