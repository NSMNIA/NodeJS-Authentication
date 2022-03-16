import React, { useEffect, useState, useContext } from 'react'
import Logging from '../../config/Logging';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export interface IAuthRouteProps {

}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
    const { children } = props;
    const { authState } = useContext(AuthContext);
    if (!authState.status) return <Navigate to={'/login'} />

    return (
        <>
            {children}
        </>
    );
}

export default AuthRoute