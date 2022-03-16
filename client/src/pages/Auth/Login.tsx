import React, { useState, useContext } from 'react'
import ErrorText from '../../components/ErrorText';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Logging from '../../config/Logging';
import { AuthContext } from '../../context/AuthContext';

type Props = {}

const Login: React.FunctionComponent = (props: Props) => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loginStatus, setLoginStatus] = useState<boolean>(false);
    const { setAuthState } = useContext(AuthContext);

    const history = useNavigate();

    Axios.defaults.withCredentials = true

    const signIn = () => {
        if (error !== '') setError('');
        if (email.length === 0 || password.length === 0) return setError('All fields are required.');
        setAuthenticating(true);
        Axios.post(`${import.meta.env.VITE_APP_SERVER}/auth/login`, {
            email: email,
            password: password
        }).then(response => {
            if (response.data.success === 0) {
                setError(response.data.message);
                setAuthenticating(false);
                return Logging.error(response.data.message);
            }
            Logging.info(response.data);
            localStorage.setItem("token", `${response.data.token}`);
            setAuthState(true);
            return history('/');
        }).catch(err => {
            Logging.error(err);
            setAuthenticating(false);
        })
    }

    return (
        <>
            <h1>Login</h1>
            <input type="email" name='email' value={email} placeholder="Email address" onChange={e => setEmail(e.target.value)} />
            <input type="password" name='password' value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button disabled={authenticating} onClick={e => signIn()}>Log in</button>
            <ErrorText error={error} />
            <small>
                <p><Link to="/register">Register</Link></p>
            </small>
        </>
    )
}

export default Login