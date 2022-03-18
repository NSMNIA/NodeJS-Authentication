import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ErrorText from '../../../components/ErrorText';
import Logging from '../../../config/Logging';

type Props = {}

const Verify = (props: Props) => {
    const { id } = useParams();
    const [error, setError] = useState<string>('');

    const history = useNavigate();

    axios.post(`${import.meta.env.VITE_APP_SERVER}/auth/verify`, {
        remember_token: id
    },{
        headers: {
            "accessToken": localStorage.getItem("token")
        } as {}
    }).then(res => {
        if(res.data.success === 0) return setError(res.data.message);
        Logging.info(res.data.message);
        return history('/login');
    })

    return (
        <>
            <ErrorText error={error}/>
        </>
    )
}

export default Verify