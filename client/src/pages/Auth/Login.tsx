import React, { useState, useContext, useEffect } from 'react'
import ErrorText from '../../components/ErrorText';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Logging from '../../config/Logging';
import { AuthContext } from '../../context/AuthContext';

type Props = {}

const Login: React.FunctionComponent = (props: Props) => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { setAuthState, authState } = useContext(AuthContext);

    const history = useNavigate();
    useEffect(() => {
        if (authState.status) return history('/');
    }, [])


    Axios.defaults.withCredentials = true

    const signIn = (e: React.SyntheticEvent) => {
        e.preventDefault();
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
            Logging.info(response.data.message);
            localStorage.setItem("token", `${response.data.token}`);
            setAuthState({
                email: response.data.user.email,
                uid: response.data.user.uid,
                tokens: {
                    accessToken: response.data.token
                },
                status: true
            });
            return history('/');
        }).catch(err => {
            Logging.error(err);
            setAuthenticating(false);
        })
    }

    return (
        <>
            <h1>Login</h1>
            <form action="" method='post' onSubmit={signIn}>
                <input type="email" name='email' value={email} placeholder="Email address" onChange={e => setEmail(e.target.value)} />
                <input type="password" name='password' value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <button disabled={authenticating}>Log in</button>
                <ErrorText error={error} />
            </form>
            <small>
                <p><Link to='/password/forgot'>Forgot password?</Link></p>
                <p><Link to="/register">Register</Link></p>
            </small>
        </>
    )
}

export default Login