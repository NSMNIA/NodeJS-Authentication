import axios from 'axios';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorText from '../../../components/ErrorText';
import Logging from '../../../config/Logging';

type Props = {}

const PasswordReset = (props: Props) => {
    const { id } = useParams();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [resetting, setResetting] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');

    const resetPassword = (e: React.SyntheticEvent )=> {
        e.preventDefault();
        if(error !== '') setError('');
        if(email.length === 0 || password.length === 0 || confirm.length === 0) return setError('All fields are required.');
        if(password !== confirm) return setError('Please make sure your password match.');
        setResetting(true);
        axios.post(`${import.meta.env.VITE_APP_SERVER}/auth/password/reset`, {
            remember_token: id,
            email: email,
            password: password
        }, {
            headers: {
                "accessToken": localStorage.getItem("token")
            } as {}
        }).then(res => {
            if (res.data.success === 0) return setError(res.data.message);
            Logging.info(res.data.message);
            setResetting(false);
            setSuccess(res.data.message);

        }).catch(err => {
            Logging.error(err);
            setResetting(false);
            return setError('Something went wrong, try again later.');
        })
    }

    return (
    <>
        <h1>
            PasswordReset
        </h1>
        <form action="" method='' onSubmit={resetPassword}>
            <input type="email" name='email' id='email' placeholder='Email address' onChange={e=>setEmail(e.target.value)}/>
            <input type="password" name='password' id='password' placeholder='Password' onChange={e=>setPassword(e.target.value)}/>
            <input type="password" name='confirm' id='confirm' placeholder='Confirm' onChange={e=>setConfirm(e.target.value)}/>
            <button type="submit" disabled={resetting || success !== ''}>
                Reset password
            </button>
            {success !== '' && (
                <>{success}</>
            )}
            <ErrorText error={error}/>
        </form>
    </>
  )
}

export default PasswordReset