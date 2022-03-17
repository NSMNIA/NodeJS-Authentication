import React, { useEffect, useContext, useState } from 'react'
import Logging from '../../config/Logging';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios';

type Props = {}

const Profile = (props: Props) => {
    const { authState } = useContext(AuthContext);
    const [profileData, setProfileData] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    const history = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_SERVER}/auth/profile`, {
            headers: {
                "accessToken": localStorage.getItem("token")
            } as {}
        }).then(response => {
            if (response.data.success === 0) return Logging.error(response.data.message);
            setProfileData(response.data.user);
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
                <div>
                    <b>Email: </b>
                    {profileData?.email}
                </div>
                <div>
                    <b>Name: </b>
                    {profileData?.firstname} {profileData?.lastname}
                </div>
                <div>
                    <b>Role: </b>
                    {profileData?.Role.role_name}
                </div>
                <div>
                    {authState.email === profileData?.email && (<button onClick={() => history('/password/change')}>Change password</button>)}
                </div>
            </div>
        </>
    )
}

export default Profile