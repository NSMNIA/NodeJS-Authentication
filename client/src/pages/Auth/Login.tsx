import React, { useEffect, useState } from 'react'
import ErrorText from '../../components/ErrorText';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Logging from '../../config/Logging';

type Props = {}

const Login: React.FunctionComponent = (props: Props) => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loginStatus, setLoginStatus] = useState<string>('');

    const history = useNavigate();

    Axios.defaults.withCredentials = true

    const signIn = () => {
        if (error !== '') setError('');
        if(email.length === 0 || password.length === 0) return setError('All fields are required.');
        setAuthenticating(true);
        Axios.post(`${import.meta.env.VITE_APP_SERVER}/login`, {
            email: email,
            password: password
        }).then(response => {
            if (response.data.success === 0) {
                setError(response.data.message);
                setAuthenticating(false);
                return Logging.error(response.data);
            }
            Logging.info(response.data);
        }).catch(err => {
            Logging.error(err);
            setAuthenticating(false);
        })
    }

    useEffect(()=>{
        Axios.get(`${import.meta.env.VITE_APP_SERVER}/login`).then(response => {
            Logging.info(response);
            if(response.data.loggedIn !== true) return setLoginStatus('');
            return setLoginStatus(response.data.user[0].username);
        })
    }, []);

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