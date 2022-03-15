import React, { useEffect, useState } from 'react'
import Logging from '../../config/Logging';
import { useNavigate } from 'react-router-dom';
import Auth from '../../config/Auth';

export interface IAuthRouteProps {

}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
    const { children } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const history = useNavigate();

    useEffect(()=>{
        const auth = Auth().then(res => {
            if (!res) {
                setLoading(false);
                return history('/login');
            }
            setLoading(false);
            Logging.info("User is detected");
            return true;
        });
    }, [])

    return (
        <>
            {loading ?
                <>Loading...</>
                : <>{children}</>
            }
        </>
    );
}

export default AuthRoute