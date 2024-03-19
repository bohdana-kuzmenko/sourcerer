import React from 'react';
import {
    Routes,
    Route,
    Link,
} from "react-router-dom";
import './App.css';
import {
    Button,
    Container,
    Header,
} from "semantic-ui-react";
import PropTypes from "prop-types";
import LoginPage from "./auth/login";
import SignInPage from "./auth/signin";
import PublicPage from "./intro";
import {AuthProvider, RequireAuth} from "./auth/utils";
import StoragesPage from "./storages";
import SettingsPage from "./settings";
import {AppNameHeaderComponent} from "./common/header";

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<PublicPage><HomepageHeading/></PublicPage>}/>
                <Route path="/authenticate" element={<LoginPage/>}/>
                <Route path="/signin" element={<SignInPage/>}/>
                <Route path="/storages" element={<RequireAuth><StoragesPage/></RequireAuth>}/>
                <Route path="/settings" element={<RequireAuth><SettingsPage/></RequireAuth>}/>
            </Routes>
        </AuthProvider>
    );
}


const HomepageHeading = () => (
    <Container text>
        <AppNameHeaderComponent/>
        <Header
            as='h2'
            content='View your storages data'
            inverted
            style={{
                fontSize: '1.7em',
                fontWeight: 'normal',
                marginTop: '1.5em',
            }}
        />
        <Link to="/storages">
            <Button primary size='huge'>
                Get Started
            </Button>
        </Link>
    </Container>
)

HomepageHeading.propTypes = {
    mobile: PropTypes.bool,
}
