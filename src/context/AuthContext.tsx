import { createContext } from 'react';

interface ContextProps {    
    isLoggedIn: boolean;
    toke?: string;
    profile?: number;

    //  Methos
    loginUser: (user: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext({} as ContextProps);