import IRoute from "../interfaces/Routes";
import Home from "../pages/Home";

const routes: IRoute[] = [
    {
        path: '/',
        element: Home,
        name: 'Home Page',
        protected: true
    }
];

export default routes;