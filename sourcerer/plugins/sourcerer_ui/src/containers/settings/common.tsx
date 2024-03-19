import {Button, Form, Icon} from "semantic-ui-react";
import React from "react";
import {toast} from "react-semantic-toasts";
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import {CLEAN_ERROR} from "../../redux/actions/storage";
import {CLEAN_SETTINGS_ERROR} from "../../redux/actions/registered-credentials";


interface InputFieldParams {
    condition?: boolean;
    onChange: Function;
    label: string;
    placeholder: string;
}

export const InputField = (props: InputFieldParams) => {
    if (props.condition !== undefined && !props.condition) {
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



interface AddItemDialogButtonParams {
    onClick: Function;
    title: string;
} 
export const AddItemDialogButton = (props: AddItemDialogButtonParams) => {
    return (
        <Button color={ "yellow" } labelPosition='left' icon onClick={ () => props.onClick(true) }>
            <Icon name='plus'/> { props.title }
        </Button>
    )
}


export const showError = (error: any, dispatch: any) => {
    toast(
        {
            title: `Error: ${ error }`,
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