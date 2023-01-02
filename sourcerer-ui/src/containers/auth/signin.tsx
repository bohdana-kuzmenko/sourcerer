import {useLocation, useNavigate} from "react-router-dom";
import React from "react";
import {Button, Container, Form, Grid, Header, Segment} from "semantic-ui-react";
import PublicPage from "../intro";
import {useAuth} from "./utils";
import {useDispatch} from "react-redux";

function SignInPage() {
    const dispatch = useDispatch()
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();

    let from = location.state?.from?.pathname || "/";

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let formData = new FormData(event.currentTarget);
        let username = formData.get("username") as string;
        auth.signin(dispatch, username, () => {
            navigate('/storages', {replace: true});
        });
    }

    return (

        <PublicPage show_home={true} show_authenticate={true}>
            <Container text textAlign='center'>
                <Header
                    as='h1'
                    content='Data Sourcer'
                    inverted
                    style={{
                        fontSize: '4em',
                        fontWeight: 'normal',
                        marginBottom: 0,
                        marginTop: '3em',
                    }}
                />
                <Grid centered relaxed>
                    <Grid.Column width={9}>
                        <Form size='mini' onSubmit={handleSubmit}>
                            <Header as='h5' attached='top'>
                                Registration
                            </Header>
                            <Segment stacked attached>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail'/>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='Name'/>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='Phone number'/>
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                /><Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Repeat Password'
                                type='password'
                            />
                                <Button color='orange' type="submit" fluid size='large'>
                                    Login
                                </Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        </PublicPage>

    );
}
export default SignInPage