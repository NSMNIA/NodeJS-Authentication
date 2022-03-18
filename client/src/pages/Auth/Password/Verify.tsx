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

    const verify = (remember_token: string) => {
        axios.post(`${import.meta.env.VITE_APP_SERVER}/auth/verify`, {
            remember_token: remember_token
        },{
            headers: {
                "accessToken": localStorage.getItem("token")
            } as {}
        }).then(res => {
            if(res.data.success === 0) return setError(res.data.message);
            Logging.info(res.data.message);
            return history('/login');
        })
    }

    useEffect(()=>{
        verify(id!!)
    }, [])

    return (
        <>
            <ErrorText error={error}/>
        </>
    )
}

export default Verify