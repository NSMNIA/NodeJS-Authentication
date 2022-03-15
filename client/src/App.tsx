import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from './config/Routes';

type Props = {}

const App: React.FunctionComponent = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    setLoading(false);
  }, [])

  if(loading)
    return <div>Loading...</div>


  return (
    <>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            // if (route.protected)
            //   return <Route key={index}
            //     path={route.path}
            //     element={<AuthRoute><route.element /></AuthRoute>} />

            return <Route key={index}
              path={route.path}
              element={<route.element />}
            />
          }
          )}
        </Routes>
      </Router>
    </>
  )
}

export default App