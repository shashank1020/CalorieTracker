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

    static addFood2 = async ({ name, calorie, userId, createdAt }) => {
        if (name && calorie > 10 && calorie <= 10000 && createdAt) {
            return {
                data: {
                    message: 'Food Item added successfully',
                },
            };
        } else {
            return {
                error: true,
                message: 'Food Item Validation Failed',
            };
        }
    };

    static fetchFoods2 = async ({ startDate, endDate, page }) => {
        if (page >= 10) return { data: [] };
        let foodItems = [];
        for (let i = 0; i < 40; i++) {
            foodItems.push({
                name: 'Food item ' + (page * 40 + i),
                id: page * 40 + i,
                calorie: 102,
                price: 10,
                userId: 2,
                dayCalorie: 120,
                monthAmount: 1100,
                createdAt: '2021-12-24 23:12:00',
                dailyThresholdLimit: 2100,
                monthlyThresholdLimit: 1000,
            });
        }
        return {
            data: {
                totalPages: 100,
                currentPage: page,
                foodItems: foodItems,
            },
        };
    };

    static updateFood2 = async (foodId, { name, calorie, userId, createdAt }) => {
        return {
            data: {
                message: 'Food updated',
            },
        };
    };

    static deleteFood2 = async ({ id }) => {
        return {
            data: {
                message: 'deleted',
            },
        };
    };

    static foodReports = async () => {};
}
