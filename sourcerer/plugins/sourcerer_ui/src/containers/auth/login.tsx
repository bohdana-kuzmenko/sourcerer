import {Link, useLocation, useNavigate} from "react-router-dom";
import React from "react";
import {Button, Container, Form, Grid, Header, Message, Segment} from "semantic-ui-react";
import PublicPage from "../intro";
import {useAuth} from "./utils";
import {useDispatch} from "react-redux";

function LoginPage() {
    const dispatch = useDispatch()
    let navigate = useNavigate();
    let auth = useAuth();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let username = formData.get("username") as string;
        let password = formData.get("password") as string;

        auth.login(dispatch, username, password,  () => {
            navigate('/storages', {replace: true});
        });
    }

    return (

        <PublicPage show_home={true}>
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
                            <Segment stacked>
                                <Form.Input fluid icon='user' name='username' iconPosition='left' placeholder='E-mail'/>
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    name='password'
                                />
                                <Button color='orange' type="submit" fluid size='large'>
                                    Login
                                </Button>
                            </Segment>
                        </Form>
                        <Message>
                            New to us? <Link to="/signin">Sign on</Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </Container>
        </PublicPage>

    );
}

export default LoginPage