import { getUserHeaders } from '../utils';
import { FoodAPI } from './service-constant';
import axios from 'axios';

export default class FoodService {
    static addFood = ({ name, calorie, price, userId, createdAt }) => {
        return axios
            .post(`${FoodAPI}`, { name, calorie, price, userId, createdAt }, getUserHeaders())
            .then((res) => {
                return res;
            })
            .catch((e) => {
                return { error: true, message: e.response.data.message };
            });
    };

    static fetchFoods = async ({ startDate, endDate, page }) => {
        const queryStringObj = {};
        queryStringObj.page = page;
        startDate && (queryStringObj.startDate = startDate);
        endDate && (queryStringObj.endDate = endDate);

        const queryString = new URLSearchParams(queryStringObj).toString();
        let data = await axios.get(`${FoodAPI}?${queryString}`, getUserHeaders());
        return data;
    };

    static updateFood = async (foodId, { name, calorie, userId, createdAt, price, ...rest }) => {
        return axios
            .put(`${FoodAPI}/${foodId}`, { name, calorie, price, createdAt }, getUserHeaders())
            .then((res) => {
                return res;
            })
            .catch((e) => {
                return { error: true, message: e.response.data.message };
            });
    };

    static deleteFood = async ({ id }) => {
        return axios
            .delete(`${FoodAPI}/${id}`, getUserHeaders())
            .then((res) => {
                return res;
            })
            .catch((e) => {
                return { error: true, message: e.response.data.message };
            });
    };
}
