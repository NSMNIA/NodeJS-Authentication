import React, { useEffect } from 'react'
import Axios from 'axios';
import { getAuth } from '../config/Auth';

type Props = {}

const Client = (props: Props) => {
    useEffect(() => {
        const authInfo = getAuth();
    }, [])

    return (
        <div>Client</div>
    )
}

export default Client