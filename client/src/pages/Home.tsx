import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import SignOut from '../components/SignOut';

type Props = {}
const Home: React.FunctionComponent = (props: Props) => {

  return (
    <div>
      <h1>
        Home
      </h1>
      <Link to={'/profile'} >Go to other profile page</Link>
      <SignOut />
    </div>
  )
}

export default Home