import {Header} from "semantic-ui-react";
import React from "react";

export const AppNameHeaderComponent = () => {
    return (
        <Header
            as='h1'
            content='Data Sourcerer'
            inverted
            style={ {
                fontSize: '4em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: '3em',
            } }
        />
    )
}
