import React, { useEffect, useContext, useState } from 'react'
import Logging from '../../config/Logging';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios';
import ErrorText from '../../components/ErrorText';

type Props = {}

const Profile = (props: Props) => {
    const { authState } = useContext(AuthContext);
    const [profileData, setProfileData] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [changing, setChanging] = useState<boolean>(false);

    const [selectedFile, setSelectedFile] = React.useState<any>(null);

    const [loading, setLoading] = useState(true);

    const uploadPhoto = (e: React.SyntheticEvent) => {
        e.preventDefault()
        setChanging(true);
        if (error !== '') setError('');
        const formData = new FormData();
        formData.append("file", selectedFile);
        axios.post(`${import.meta.env.VITE_APP_SERVER}/auth/upload`, formData, {
            headers: {
                "accessToken": localStorage.getItem("token")
            } as {}
        }).then(res => {
            if (res.data.success === 0) return setError(res.data.message);
            Logging.info(res.data.message);
            setChanging(false);
            return getProfile();;
        }).catch(err => {
            Logging.error(err);
            setChanging(false);
            return setError('Something went wrong, try again later.');
        })
    }

    const history = useNavigate();

    const getProfile = () => {
        axios.get(`${import.meta.env.VITE_APP_SERVER}/auth/profile`, {
            headers: {
                "accessToken": localStorage.getItem("token")
            } as {}
        }).then(response => {
            if (response.data.success === 0) return Logging.error(response.data.message);
            setProfileData(response.data.user);
            setLoading(false);
        })
    }

    useEffect(() => {
        getProfile();
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
                    <img height="450" src={`${import.meta.env.VITE_APP_SERVER}/uploads/${profileData?.profile_image}`} alt="profile_image" />
                </div>

                <form action="" method="post" encType='multipart/form-data' onSubmit={uploadPhoto}>
                    <input type="file" name='image' onChange={(e: any) => setSelectedFile(e.target.files[0])} />
                    <button type="submit" disabled={changing}>
                        Submit
                    </button>

                    <ErrorText error={error} />
                </form>
                <div>
                    {authState.email === profileData?.email && (<button onClick={() => history('/password/change')}>Change password</button>)}
                </div>
            </div>
        </>
    )
}

export default Profile