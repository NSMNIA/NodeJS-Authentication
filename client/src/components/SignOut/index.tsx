import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Props = {}

const SignOut = (props: Props) => {
    const { setAuthState, authState } = useContext(AuthContext);
    const history = useNavigate();
    const signOut = () => {
        localStorage.removeItem('token');
        setAuthState({ ...authState, status: false });
        return history('/login');
    }

    return (
        <button onClick={signOut}>
            Sign out
        </button>
    )
}

export default SignOut