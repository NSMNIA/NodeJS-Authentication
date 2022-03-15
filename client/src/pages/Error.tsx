import React from 'react'

type Props = {
    statusCode: number,
    statusMessage: string
}

const ErrorPage = (props: Props) => {
  return (
    <>
        <h1>
        { props.statusCode }
        </h1>
        <p>
            { props.statusMessage }
        </p>
    </>
  )
}

export default ErrorPage