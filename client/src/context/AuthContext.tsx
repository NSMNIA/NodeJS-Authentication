import { createContext } from 'react';
import IAuth, { defaultAuth } from '../interfaces/Auth';

export const AuthContext = createContext<IAuth>({
    authState: defaultAuth,
    setAuthState: () => { }
});