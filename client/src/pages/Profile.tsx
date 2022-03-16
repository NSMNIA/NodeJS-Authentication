import React, { useEffect, useContext } from 'react'
import Logging from '../config/Logging';
import { AuthContext } from '../context/AuthContext'

type Props = {}

const Profile = (props: Props) => {
    const { authState } = useContext(AuthContext);
    return (
        <>
            <h1>
                Profile
            </h1>
            <div></div>
        </>
    )
}

export default Profile