import { FC, JSX, useEffect, useReducer, useState } from 'react';
// UI
import { ProgressSpinner } from 'primereact/progressspinner';
// UTILS
import { axiosApi } from '../api/axiosApi';
import { authReducer } from './authReducer';
import { AuthContext } from './AuthContext';
// import { LoginForm } from '../interfaces/login';
import { AxiosError } from '../interfaces/general';
import ToastService from '../plugins/ToastService';
// import Cookies from "js-cookie";

export interface AuthState {
    isLoggedIn: boolean;
    menuCollapse: boolean;  
    token?: string;
    profile?: number;
}

interface Props {
    children: JSX.Element | JSX.Element[]
}

const Auth_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    menuCollapse: false,
    token: undefined,
    profile: undefined
}

export const AuthProvider: FC<Props> = ({children}) => {

    const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);
    const [validating, setValidating] = useState(true);

    useEffect(() => {
        checkToken(); 
        //eslint-disable-next-line   
    }, []);

    const checkToken = async() => {
        // if (!Cookies.get("tokenElGranCacao")) return setValidating(false);

        // try {
        //     const { data } = await axiosApi.get('validate_token');
        //     const { token, profile } = data;
        //     dispatch({ type: 'Auth - Login', payload: { token, profile} });
        //     setValidating(false);
        //     return true;
        // } catch (error) {
        //     console.log('error', error);
        //     setValidating(false);
        //     logout();
        //     ToastService.apiError(error as AxiosError);
        //     return false;
        // }
    }

    // if (validating) return (<div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>)

    const loginUser = async(user: string, password: string)/* : Promise<boolean> */ => {
        // const params = { user, password } as LoginForm;
        // try {
        //     const { data } = await axiosApi.post('/start_section', params);
        //     const { token, profile } = data;
          
        //     Cookies.set("tokenElGranCacao", token);
        //     dispatch({ type: 'Auth - Login', payload: { token, profile} });
        //     return true;

        // } catch (error) {
        //     console.log('error', error);
        //     ToastService.apiError(error as AxiosError);
        //     return false
        // }
        return true;
    }

    const logout = () => {
        // dispatch({ type: 'Auth - Logout' });
        // Cookies.remove("tokenElGranCacao");
    }

    if (validating) return (<div className="flex items-center justify-center min-h-screen"><ProgressSpinner /></div>)

    return (
        <AuthContext.Provider value={{
            ...state,

            // Methos
            loginUser,
            logout,
        }}>
            { children }
        </AuthContext.Provider>
    )
}
