import React from "react";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {USER_AUTHORISE_FAILED, USER_AUTHORISE_START, USER_AUTHORISE_SUCCESS} from "../../redux/actions/auth";
import {UsersApi} from "../../api/users-api";
import {client} from "../../api/client";
import {Dropdown, Grid, Loader} from "semantic-ui-react";


const selectUser = (state: any) => state.user

interface AuthContextType {
    user: any;
    get_current_user: (dispatch: any, user: any) => void;
    login: (dispatch: any, username: string, password: string, callback: VoidFunction) => void;
    signin: (dispatch: any, firstName: string, lastName: string, email: string, password: string,  callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({children}: { children: React.ReactNode }) {
    let login = (dispatch: any, username: string, password: string, callback: VoidFunction) => {
        (new UsersApi()).login(dispatch, username, password, callback)
    };

    let get_current_user = (dispatch: any, user: any) => {
        (new UsersApi()).getCurrentUser(dispatch, user)
    }
    let signin = (dispatch: any, firstName: string, lastName: string, email: string, password: string, callback: VoidFunction) => {
        (new UsersApi()).signin(dispatch, firstName, lastName, email, password, callback)
    };

    let signout = (callback: VoidFunction) => {};

    let user = useSelector(selectUser).email;
    let value = {user, login, signin, get_current_user, signout};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthStatus() {
    let auth = useAuth();
    let navigate = useNavigate();

    if (!auth.user) {
        return <p>You are not logged in.</p>;
    }

    return (
        <Dropdown item simple text={auth.user}>
            <Dropdown.Menu>
                <Dropdown.Item onClick={()=>navigate('/settings')}>Settings</Dropdown.Item> {/* auth.signout(() => navigate("/"));*/}
                <Dropdown.Item>SignOut</Dropdown.Item> {/* auth.signout(() => navigate("/"));*/}
            </Dropdown.Menu>
        </Dropdown>

    );
}

export function RequireAuth({children}: { children: JSX.Element }) {
    let auth = useAuth();
    let dispach = useDispatch()

    let location = useLocation();
    let userSelector = useSelector(selectUser)


    if (!userSelector.failed && userSelector.email === null) {
        auth.get_current_user(dispach, userSelector)
    }

    let readyForRender = !userSelector.loading;
    let userAuthorized = !userSelector.failed && !userSelector.loading;

    if (readyForRender) {
        if (userAuthorized) {
            return children
        } else {
            return <Navigate to="/authenticate" state={{from: location}} replace/>;
        }
    } else {
        return  (
            <Grid verticalAlign='middle' style={{height: '100%'}}>
                <Grid.Column>
                    <Loader active  size='massive' inline='centered' />
                </Grid.Column>
            </Grid>

        )
    }
}

