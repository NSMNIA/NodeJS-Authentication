import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import ErrorText from '../../components/ErrorText';
import Logging from '../../config/Logging';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

type Props = {}

const validateEmail: Function = (email: string) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const Register: React.FunctionComponent = (props: Props) => {
    const { authState } = useContext(AuthContext);
    const [registering, setRegistering] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [error, setError] = useState<string>('');

    const history = useNavigate();
    useEffect(() => {
        if (authState.status) return history('/');
    }, [])

    Axios.defaults.withCredentials = true

    const registerUser = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (error !== '') setError('');
        if (email.length === 0 || password.length === 0 || firstname.length === 0 || lastname.length === 0) return setError('All fields are required.');
        if (password !== confirm) return setError('Please make sure your password match.');
        if (!validateEmail(email)) return setError('Not a valid email address.');
        setRegistering(true);
        Axios.post(`${import.meta.env.VITE_APP_SERVER}/auth/register`, {
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: password
        }).then(response => {
            if (response.data.success === 0) {
                setError(response.data.message);
                setRegistering(false);
                return Logging.error(response.data.message);
            }
            Logging.info(response.data.message);
            return history('/login');
        }).catch(err => {
            Logging.error(err);
            setRegistering(false);
        })
    }

    return (
        <>
            <h1>Register</h1>
            <form action="" method='post' onSubmit={registerUser}>
                <input type="email" name='email' id='email' placeholder='Email address' onChange={e => setEmail(e.target.value)} value={email} />
                <input type="text" name='firstname' id='firstname' placeholder='Firstname' onChange={e => setFirstname(e.target.value)} value={firstname} />
                <input type="text" name='lastname' id='lastname' placeholder='Lastname' onChange={e => setLastname(e.target.value)} value={lastname} />
                <input type="password" name='password' id='password' placeholder='Password' onChange={e => setPassword(e.target.value)} value={password} autoComplete="new-password" />
                <input type="password" name='confirm' id='confirm' placeholder='Password confirm' onChange={e => setConfirm(e.target.value)} value={confirm} autoComplete="new-password" />
                <button disabled={registering} type='submit'>
                    Sign up
                </button>
                <ErrorText error={error} />
            </form>
            <small>
                <p><Link to="/login">Login</Link></p>
            </small>
        </>
    )
}

export default Register