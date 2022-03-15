import IRoute from "../interfaces/Routes";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home";

const routes: IRoute[] = [
    {
        path: '/',
        element: Home,
        name: 'Home Page',
        protected: true
    },
    {
        path: '/register',
        element: Register,
        name: 'Register page',
        protected: false
    }
];

export default routes;