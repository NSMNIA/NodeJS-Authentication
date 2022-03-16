import React from 'react'
import './style.scss';

export interface IError {
    error: string
}

const ErrorText: React.FunctionComponent<IError> = props => {
    const { error } = props;

    if (error === '') return null;

    return (
        <small className='alert alert--danger'>
            {error}
        </small>
    )
}

export default ErrorText