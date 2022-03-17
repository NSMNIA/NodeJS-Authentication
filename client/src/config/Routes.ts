import IRoute from "../interfaces/Routes";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Auth/Profile";
import Home from "../pages/Home";
import PasswordChange from "../pages/Auth/Password/Change";
import ForgotPassword from "../pages/Auth/Password/Forgot";

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
    },
    {
        path: '/login',
        element: Login,
        name: "Login page",
        protected: false
    }, {
        path: '/profile',
        element: Profile,
        name: "Client page",
        protected: true
    }, {
        path: '/password/change',
        element: PasswordChange,
        name: 'Change Password',
        protected: true
    }, {
        path: '/password/forgot',
        element: ForgotPassword,
        name: "Forgot Password",
        protected: false
    }
];

export default routes;