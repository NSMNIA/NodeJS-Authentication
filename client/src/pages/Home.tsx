import React, { useContext } from 'react'
import { Link } from 'react-router-dom';

type Props = {}
const Home: React.FunctionComponent = (props: Props) => {

  return (
    <div>
      <h1>
        Home
      </h1>
      <Link to={'/client'} >Go to other protected page</Link>

    </div>
  )
}

export default Home