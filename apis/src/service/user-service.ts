import { ForbiddenException, Injectable } from '@nestjs/common';

import UserEntity from '..//db/entity/user.entity';
import FoodEntity from '..//db/entity/food.entity';
import * as moment from 'moment';
import * as _ from 'lodash';
import { getManager, getRepository } from 'typeorm';

@Injectable()
export default class UserService {
  async generateReports(user: UserEntity) {
    if (!user?.isAdmin) throw new ForbiddenException();
    const now = moment().format(`YYYY-MM-DD`);
    const sevenDaysBack = moment().subtract(7, 'day').format(`YYYY-MM-DD`);
    const fourteenDayBack = moment().subtract(14, 'day').format(`YYYY-MM-DD`);
    const currentWeekEntries = await getRepository(FoodEntity)
      .createQueryBuilder('food')
      .where('food.date >= :startDate and food.date <= :endDate', {
        startDate: sevenDaysBack,
        endDate: now,
      })
      .getCount();

    const prevWeekEntries = await getRepository(FoodEntity)
      .createQueryBuilder('food')
      .where('food.date >= :startDate and food.date < :endDate', {
        startDate: fourteenDayBack,
        endDate: sevenDaysBack,
      })
      .getCount();

    const totalUserEntries = await getManager().query(
      `select count(distinct userId) as count, sum(calorie) as calorie from food where date between '${sevenDaysBack}' and '${now}'`,
    );
    const { count, calorie } = totalUserEntries[0];

    return {
      currentWeekEntries,
      prevWeekEntries,
      totalCalorieInLastSevenDays: calorie,
      totalUserInLastSevenDays: count,
      averageCaloriePerUser:
        count === 0
          ? 0
          : Number(Number((calorie * 1.0) / (count * 1.0)).toFixed(2)),
    };
  }
}
