import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthRoute from './components/AuthRoute';
import routes from './config/Routes';
import ErrorPage from './pages/Error';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import Logging from './config/Logging';

type Props = {}

const App: React.FunctionComponent = (props: Props) => {
  const [authState, setAuthState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_SERVER}/auth/check`, {
      headers: {
        "accessToken": localStorage.getItem("token")
      } as {}
    }).then((response) => {
      if (response.data.success === 0) {
        setAuthState(false);
        return setLoading(false);
      }
      setAuthState(true);
      return setLoading(false);
    })
  }, [])

  if (loading) return (<>
    Loading...
  </>);

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Routes>
            {routes.map((route, index) => {
              if (route.protected)
                return <Route key={index}
                  path={route.path}
                  element={<AuthRoute><route.element /></AuthRoute>} />

              return <Route key={index}
                path={route.path}
                element={<route.element />}
              />
            }
            )}
            <Route path='*' element={<ErrorPage statusCode={404} statusMessage={"Not found"} />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </>
  )
}

export default App