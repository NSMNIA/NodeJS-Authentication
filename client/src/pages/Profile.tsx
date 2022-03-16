import React, { useEffect, useContext, useState } from 'react'
import Logging from '../config/Logging';
import { AuthContext } from '../context/AuthContext'
import axios from 'axios';

type Props = {}

const Profile = (props: Props) => {
    const { authState } = useContext(AuthContext);
    const [firstname, setFirstname] = useState(null);
    const [lastname, setLastname] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_SERVER}/auth/profile`, {
            headers: {
                "accessToken": localStorage.getItem("token")
            } as {}
        }).then(response => {
            if (response.data.success === 0) return Logging.error(response.data.message);
            setFirstname(response.data.user.firstname);
            setLastname(response.data.user.lastname);
            setLoading(false);
        })
    }, []);

    if (loading) return (
        <>
            <h1>Profile</h1>
            Loading profile information.
        </>
    );

    return (
        <>
            <h1>
                Profile
            </h1>
            <div>
                {firstname} {lastname}
            </div>
        </>
    )
}

export default Profile