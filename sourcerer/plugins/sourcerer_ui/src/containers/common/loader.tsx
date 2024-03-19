import {Grid, Loader} from "semantic-ui-react";
import React from "react";

export const PageLoader = () => {
    return (
        <Grid verticalAlign='middle' style={ {height: '100%'} }>
            <Grid.Column>
                <Loader active size='massive' inline='centered'/>
            </Grid.Column>
        </Grid>
    )
}
