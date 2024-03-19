import React from "react";
import {Container, Grid, Menu} from "semantic-ui-react";
import {AuthStatus} from "../auth/utils";
import {useNavigate} from "react-router-dom";
import {SemanticToastContainer} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import CredentialsSettings from "./credentials_settings";
import StoragesSettings from "./storages_settings";



export default function SettingsPage() {
    let navigate = useNavigate();

    return (
        <>
            <SemanticToastContainer className={ "customToast" }/>
            <Menu fixed='top' inverted style={ {backgroundColor: '#011627'} }>
                <Container>
                    <Menu.Item as='a' onClick={ () => navigate('/storages') }>Home</Menu.Item>
                    <Menu.Item position='right'> <AuthStatus/></Menu.Item>
                </Container>
            </Menu>
            <Grid style={ {height: '100%', padding: '14px', paddingTop: '70px'} }>
                <Grid.Column textAlign='right'>
                    <CredentialsSettings/>
                    <br/>
                    <br/>
                    <StoragesSettings/>
                </Grid.Column>
            </Grid>
        </>
    );
}

