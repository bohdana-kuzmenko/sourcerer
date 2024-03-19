import {Image, Modal, Segment} from "semantic-ui-react";
import React from "react";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {tomorrow} from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewModalProps {
    open: boolean;
    onOpen: Function;
    onClose: Function;
    previewKey: string;
    keyPreviewLoading: boolean;
    previewContentType: string;
    previewContent: any;
}


export const PreviewModalContent = (props: PreviewModalProps) => {

    return (
        <Modal
            open={ props.open }
            onClose={ () => props.onClose() }
            onOpen={ () => props.onOpen() }
        >
            <Modal.Header>Preview { props.previewKey }</Modal.Header>
            <Modal.Content image={ !props.keyPreviewLoading && props.previewContentType === 'image' }>
                { !props.keyPreviewLoading && props.previewContentType === 'image' && (
                    <Image src={ props.previewContent }/>
                ) }
                { !props.keyPreviewLoading && ['json', 'xml', 'yaml'].indexOf(props.previewContentType) > -1 && (
                    <Segment>
                        <SyntaxHighlighter language={ props.previewContentType } style={ tomorrow }>
                            { props.previewContent }
                        </SyntaxHighlighter>
                    </Segment>
                ) }
                { !props.keyPreviewLoading && props.previewContentType === 'text' && (
                    <Segment>
                        { props.previewContent }
                    </Segment>
                ) }
                { !props.keyPreviewLoading && props.previewContentType === 'audio' && (
                    <Segment>
                        <audio style={ {width: '100%'} } controls src={ props.previewContent }/>
                    </Segment>
                ) }
                { props.keyPreviewLoading && (
                    <Segment>
                        Loading...
                    </Segment>)
                }
            </Modal.Content>
        </Modal>
    )
}
