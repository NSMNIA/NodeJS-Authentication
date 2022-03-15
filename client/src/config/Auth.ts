import Axios from 'axios';
import Logging from './Logging';

const Auth = () => {
    let authenticated: Promise<boolean> = Axios.get(`${import.meta.env.VITE_APP_SERVER}/isAuth`, {
        headers: {
            "x-access-token": localStorage.getItem("token")
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

export default Auth;