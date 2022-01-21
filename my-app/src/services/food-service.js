export default class FoodService {
    static addFood = async ({name, calorie, userId, dateTime}) => {

    }

    static fetchFoods = async ({startDate, endDate, page}) => {
        return [
            {
                name: 'Food item 1',
                id: 1,
                calorie: 102,
                price: 10,
                userId: 2,
                dayCalorie: 120,
                monthAmount: 1100,
                createdAt: '2021-12-24 23:12:00',
                dailyThresholdLimit: 2100,
                monthlyThresholdLimit: 1000
            },
            {
                name: 'Food item 2',
                id: 2,
                calorie: 105,
                price: 14,
                userId: 3,
                dayCalorie: 2123,
                monthAmount: 921,
                createdAt: '2021-12-25 23:11:00',
                dailyThresholdLimit: 2100,
                monthlyThresholdLimit: 1000
            },
            {
                id: 3,
                name: 'Buffallow Milk',
                createdAt: '2021-12-25 23:12:00',
                calorie: 450,
                price: 210,
                userId: 4,
                dayCalorie: 2300,
                monthAmount: 1200,
                dailyThresholdLimit: 2100,
                monthlyThresholdLimit: 1000
            },
            {
                name: 'Food item 3',
                id: 4,
                calorie: 165,
                price: 16,
                userId: 4,
                dayCalorie: 123,
                monthAmount: 921,
                createdAt: '2014-12-24 23:11:00',
                dailyThresholdLimit: 2100,
                monthlyThresholdLimit: 1000
            }
        ];
    }

    static updateFood = async (foodId, {name, calorie, userId, dateTime}) => {

    }

    static deleteFood = async (foodId) => {

    }

    static foodReports = async () => {

    }
}