export default class FoodService {
    static addFood = async ({ name, calorie, userId, dateTime }) => {
        if (name && calorie > 10 && calorie <= 10000 && dateTime) {
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

    static fetchFoods = async ({ startDate, endDate, page }) => {
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

    static updateFood = async (foodId, { name, calorie, userId, dateTime }) => {
        return {
            data: {
                message: 'Food updated',
            },
        };
    };

    static deleteFood = async ({ id }) => {
        return {
            data: {
                message: 'deleted',
            },
        };
    };

    static foodReports = async () => {};
}
