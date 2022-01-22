export default class ReportsService {
    static getReports = async () => {
        return {
            data: {
                currentWeakEntries: 17,
                prevWeekEntries: 43,
                todayEntries: 3,
            },
        };
    };
}
