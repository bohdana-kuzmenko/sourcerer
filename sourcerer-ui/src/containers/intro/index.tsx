import {createMedia} from "@artsy/fresnel";
import React from "react";
import {Button, Container, Menu, Segment, Visibility} from "semantic-ui-react";
import {Link} from "react-router-dom";


const {MediaContextProvider, Media} = createMedia({
    breakpoints: {
        mobile: 0,
        tablet: 768,
        computer: 1024,
    },
})

interface PublicPageProps {
    show_authenticate?: boolean; // 👈️ for demo purposes
    show_home?: boolean; // 👈️ for demo purposes
    children?: React.ReactNode; // 👈️ for demo purposes
}

const PublicPage = (props: PublicPageProps) => {
    return (
        <Media greaterThan='mobile'>
            <Visibility
                once={false}
            >
                <Segment
                    inverted
                    textAlign='center'
                    style={{minHeight: 700, padding: '1em 0em', backgroundColor: '#011627'}}
                    vertical
                >
                    <Menu
                        fixed={'top'}
                        inverted={false}
                        pointing={false}
                        secondary={false}
                        size='large'
                    >
                        <Container>
                            <Menu.Item position='right'>
                                {props.show_authenticate && <Link to="/authenticate">
                                    <Button inverted={false}>
                                        Log in
                                    </Button>
                                </Link>
                                }
                                {props.show_home && <Link to="/">
                                    <Button inverted={false}>
                                        Home
                                    </Button>
                                </Link>
                                }
                            </Menu.Item>
                        </Container>
                    </Menu>
                    {props.children}
                </Segment>
            </Visibility>
        </Media>
    );
}

export default PublicPage