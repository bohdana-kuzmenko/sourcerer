import {Grid, Message} from "semantic-ui-react";
import React from "react";
import {useNavigate} from "react-router-dom";

export const NoItemsNotification = () => {
    const navigate = useNavigate();
    return (
        <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
            <Grid.Column style={{maxWidth: 450}}>
                <Message>
                    No storages available. ? <a className={"pointer"} onClick={() => navigate('/settings')}>Add new
                    credentials</a>
                </Message>
            </Grid.Column>
        </Grid>
    )
}