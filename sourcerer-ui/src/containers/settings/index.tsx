import {useDispatch, useSelector} from "react-redux";
import {StoragesApi} from "../../api/storages-api";
import React, {useState} from "react";
import {Button, Checkbox, Container, Divider, Form, Grid, Icon, Menu, Modal, Table} from "semantic-ui-react";
import {AuthStatus} from "../auth/utils";
import {useNavigate} from "react-router-dom";
import {SettingsApi} from "../../api/settings-api";


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
export default function SettingsPage() {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    let selector = useSelector(selectRegisteredCredentials);

    let registeredCredentials = selector.items;
    let registeredCredentialsLoading = selector.loading;
    const settingsApi = new SettingsApi()

    if (registeredCredentials.length === 0) {
        settingsApi.getRegistrations(dispatch, registeredCredentialsLoading);
    }

    const [open, setOpen] = React.useState(false)
    const [formData, setFormData] = React.useState({})
    const [provider, setProvider] = React.useState("")
    const options = [
        {key: 'blobby', text: 'Blobby', value: 'BLOBBY'},
        {key: 'mcqueen', text: 'McQueen', value: 'MCQUEEN'},
        {key: 'apple_s3', text: 's3 (Apple)', value: 'APPLE_S3'},
        {key: 's3', text: 's3', value: 'S3'},
    ]

    const S3_COMPATIBLE_BUCKETS = ['BLOBBY', 'MCQUEEN', 'APPLE_S3', 'S3']
    let send = async () => {
        await settingsApi.addRegistration(dispatch, {
            provider: provider,
            credentials: formData
        })
        settingsApi.getRegistrations(dispatch, registeredCredentialsLoading);
    }

    return (
        <>
            <Menu fixed='top' inverted style={ {backgroundColor: '#011627'} }>
                <Container>
                    <Menu.Item as='a' onClick={ () => navigate('/storages') }>Home</Menu.Item>
                    <Menu.Item position='right'> <AuthStatus/></Menu.Item>
                </Container>
            </Menu>
            <Grid style={ {height: '100%', padding: '14px', paddingTop: '70px'} }>
                <Grid.Column textAlign='right'>
                    <Button color={ "yellow" } labelPosition='left' icon onClick={ () => setOpen(true) }>
                        <Icon name='plus'/> Add Credentials
                    </Button>
                    <Table>
                        <Table.Header>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Provider</Table.HeaderCell>
                            <Table.HeaderCell>Credentials</Table.HeaderCell>
                            <Table.HeaderCell>Date created</Table.HeaderCell>
                        </Table.Header>
                        <Table.Body>
                            {
                                registeredCredentials.map((creds: any) => {
                                    return (
                                        <Table.Row>
                                            <Table.Cell collapsing><Checkbox slider
                                                                             checked={ creds.active }/></Table.Cell>
                                            <Table.Cell>{ creds.provider }</Table.Cell>
                                            <Table.Cell>{ creds.credentials }</Table.Cell>
                                            <Table.Cell>{ creds.created_at }</Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid>
            <Modal
                onClose={ () => {
                    setProvider("")
                    setFormData({})
                    setOpen(false)
                } }
                onOpen={ () => {
                    setProvider("")
                    setFormData({})
                    setOpen(true)
                } }
                open={ open }
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
                            condition={ S3_COMPATIBLE_BUCKETS.indexOf(provider) > -1 }
                            onChange={ (event: any) => setFormData({
                                ...formData,
                                endpoint_url: event.target.value,
                            }) }
                            label={ "Endpoint url" }
                            placeholder={ "Endpoint url" }
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
                        setOpen(false)
                    } }>Cancel</Button>
                    <Button onClick={ () => {
                        send();
                        setProvider("")
                        setFormData({})
                        setOpen(false)
                    } } positive>
                        Ok
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}

