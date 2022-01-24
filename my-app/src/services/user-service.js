import { getToken, getUserHeaders, openNotification } from '../utils';
import { RootAPI, UserAPI } from './service-constant';
import axios from 'axios';

export default class UserService {
    static getUserDetail = async () => {
        return axios
            .get(`${UserAPI}/details`, getUserHeaders())
            .then((res) => {
                console.log(res);
                if (res.data.user) return res.data.user;

                throw new Error('Authentication failed');
            })
            .catch((e) => {
                console.log('e', e);
                openNotification({ type: 'error', message: 'Auth Failed' });
            });
    };
}
