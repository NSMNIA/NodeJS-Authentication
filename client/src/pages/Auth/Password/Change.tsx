import React, { useState } from 'react'
import ErrorText from '../../../components/ErrorText';
import Logging from '../../../config/Logging';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Props = {}

const PasswordChange = (props: Props) => {
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [changing, setChanging] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const history = useNavigate();

    const changePassword = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (error !== '') setError('');
        if (currentPassword.length === 0 || newPassword.length === 0 || confirmPassword.length === 0) return setError('All fields are required');
        if (newPassword !== confirmPassword) return setError('Please make sure your password match.');
        if (currentPassword === newPassword) return setError('Current password is equal to the new password.');

        setChanging(true);
        axios.post(`${import.meta.env.VITE_APP_SERVER}/auth/password/change`, {
            currentPassword: currentPassword,
            newPassword: newPassword
        }, {
            headers: {
                "accessToken": localStorage.getItem("token")
            } as {}
        }).then(res => {
            if (res.data.success === 0) return setError(res.data.message);
            Logging.info(res.data.message);
            setChanging(false);
            return history('/profile');
        }).catch(err => {
            Logging.error(err);
            setChanging(false);
            return setError('Something went wrong, try again later.');
        })
    }

    return (
        <>
            <h1>Change your password</h1>
            <form action="" method='post' onSubmit={changePassword}>
                <input type="password" name="currentPassword" id="currentPassword" placeholder='Current password' onChange={e => setCurrentPassword(e.target.value)} />
                <input type="password" name="newPassword" id="newPassword" placeholder='New password' onChange={e => setNewPassword(e.target.value)} />
                <input type="password" name="confirmPassword" id="confirmPassword" placeholder='Confirm password' onChange={e => setConfirmPassword(e.target.value)} />
                <button type="submit" disabled={changing}>Change password</button>
            </form>
            <ErrorText error={error} />
        </>
    )
}

export default PasswordChange