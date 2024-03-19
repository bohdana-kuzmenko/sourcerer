import {Button} from "semantic-ui-react";
import React from "react";

export const ButtonSimple = (props: any) => {
    return <Button inverted={ false }>{ props.label }</Button>
}