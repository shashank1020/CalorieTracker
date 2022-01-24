import axios from 'axios';
import { getUserHeaders, openNotification } from '../utils';
import { UserAPI } from './service-constant';

export default class ReportsService {
    static getReports = async () => {
        return axios
            .get(`${UserAPI}/reports`, getUserHeaders())
            .then((res) => {
                if (res.data) {
                    console.log(res.data);
                    return res.data;
                }
            })
            .catch((e) => {
                openNotification({ type: 'error', message: 'failed to fetch reports' });
            });
    };
}
