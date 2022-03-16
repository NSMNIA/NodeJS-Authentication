import Axios from 'axios';
import Logging from './Logging';

const Auth = () => {
    let authenticated: Promise<boolean> = Axios.get(`${import.meta.env.VITE_APP_SERVER}/auth/check`, {
        headers: {
            "accessToken": sessionStorage.getItem("token")
        } as any
    }).then(response => {
        if (response.data.success !== 1) {
            Logging.error(response.data.message);
            return false;
        }

        return true;
    }).catch(err => {
        Logging.error(err);
        return false;
    })
    return authenticated;
}

export const getAuth = () => {
    // Logging.info('Test');
}

export default Auth;