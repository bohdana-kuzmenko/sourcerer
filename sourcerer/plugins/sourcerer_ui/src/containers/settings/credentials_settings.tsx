import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {Button, Checkbox, Divider, Form, Icon, Modal, Table} from "semantic-ui-react";
import {SettingsApi} from "../../api/settings-api";
import {toast} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import {CLEAN_ERROR} from "../../redux/actions/storage";
import {CLEAN_SETTINGS_ERROR} from "../../redux/actions/registered-credentials";


interface InputFieldParams {
    condition: boolean;
    onChange: Function;
    label: string,
    placeholder: string
}

const InputField = (props: InputFieldParams) => {
    if (!props.condition) {
        return null
    }
    return (
        <Form.Field
            onChange={ props.onChange }>
            <label>{ props.label }</label>
            <input placeholder={ props.placeholder }/>
        </Form.Field>
    )


}

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
        toast(
            {
                title: "Error:" + registeredCredentialsSelector.error,
                type: "error",
                time: 5000,
                color: "yellow",
                icon: "exclamation",
                size: "tiny"
            },
            () => dispatch({type: CLEAN_ERROR}),
            () => dispatch({type: CLEAN_ERROR}),
            () => dispatch({type: CLEAN_ERROR})
        );
        dispatch({type: CLEAN_SETTINGS_ERROR})
    }

    const [credentialsOpen, setCredentialsOpen] = React.useState(false)
    const [formData, setFormData] = React.useState({})
    const [provider, setProvider] = React.useState("")
    const options = [
        {key: 'blobby', text: 'Blobby', value: 'BLOBBY'},
        {key: 'mcqueen', text: 'McQueen', value: 'MCQUEEN'},
    ]

    const S3_COMPATIBLE_BUCKETS = ['BLOBBY', 'MCQUEEN', 'APPLE_S3', 'S3']
    let saveCredentials = async () => {
        await settingsApi.addRegistration(dispatch, {
            provider: provider,
            credentials: formData
        })
        settingsApi.getRegistrations(dispatch, registeredCredentialsLoading);
    }
    
    let onActiveChange = async (creds: any) => {
        if (creds.active) {
            await settingsApi.deactivateRegistration(dispatch, creds.id)
        } else {
            await settingsApi.activateRegistration(dispatch, creds.id)
        }
        settingsApi.getRegistrations(dispatch, registeredCredentialsLoading);
    }


    return (
        <>
            <Divider horizontal> Registered Credentials</Divider>
            <Button color={ "yellow" } labelPosition='left' icon onClick={ () => setCredentialsOpen(true) }>
                <Icon name='plus'/> Add Credentials
            </Button>
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
                                    <Table.Cell>{ creds.credentials }</Table.Cell>
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
                        <InputField
                            condition={ S3_COMPATIBLE_BUCKETS.indexOf(provider) > -1 }
                            onChange={ (event: any) => setFormData({
                                ...formData,
                                secret_access_key: event.target.value,
                            }) }
                            label={ "AWS Secret Access Key" }
                            placeholder={ "AWS Secret Access Key" }
                        />
                        <InputField
                            condition={ S3_COMPATIBLE_BUCKETS.indexOf(provider) > -1 }
                            onChange={ (event: any) => setFormData({
                                ...formData,
                                access_key: event.target.value,
                            }) }
                            label={ "AWS Access Key" }
                            placeholder={ "AWS Secret Access Key" }
                        />
                        <InputField
                            condition={ ["MCQUEEN"].indexOf(provider) > -1 }
                            onChange={ (event: any) => setFormData({
                                ...formData,
                                region: event.target.value,
                            }) }
                            label={ "Region" }
                            placeholder={ "Region" }
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

