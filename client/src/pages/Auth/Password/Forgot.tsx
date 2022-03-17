import axios from 'axios';
import React, { useState } from 'react'
import ErrorText from '../../../components/ErrorText';
import Logging from '../../../config/Logging';

type Props = {}

const ForgotPassword = (props: Props) => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [updating, setUpdating] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');

    const resetEmail = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (error !== '') setError('');
        if (email.length === 0) return setError('Email is required.');

        setUpdating(true);
        axios.post(`${import.meta.env.VITE_APP_SERVER}/auth/password/forgot`, {
            email: email
        }, {
            headers: {
                "accessToken": localStorage.getItem("token")
            } as {}
        }).then(res => {
            if (res.data.success === 0) return setError(res.data.message);
            Logging.info(res.data.message);
            setUpdating(false);
            setSuccess(`Password reset link is sent to '${email}'`);
            setEmail('');

        }).catch(err => {
            Logging.error(err);
            setUpdating(false);
            return setError('Something went wrong, try again later.');
        })
    }

    return (
        <>
            <h1>Reset password</h1>
            <form action="" method='post' onSubmit={resetEmail}>
                <input type="email" id='email' name='email' onChange={e => setEmail(e.target.value)} />
                <button type="submit" disabled={updating || success !== ''}>Send password reset link</button>
            </form>
            {success !== '' && (
                <>{success}</>
            )}
            <ErrorText error={error} />
        </>
    )
}

export default ForgotPassword