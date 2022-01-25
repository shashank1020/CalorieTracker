import {
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  validateFoodEntry,
  validateFoodListing,
} from '../validator/food-validator';

import UserEntity from '../db/entity/user.entity';
import FoodEntity from '../db/entity/food.entity';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Between, getManager, getRepository, In } from 'typeorm';

@Injectable()
export default class FoodService {
  async createFood(
    body: {
      createdAt: string;
      name: string;
      calorie: number;
      price: number;
      userId?: number;
    },
    authUser: UserEntity,
  ) {
    const { value, error } = validateFoodEntry(body);
    if (error) throw new HttpException(error.message, 400);
    const { createdAt, name, calorie, price } = value;
    const food = new FoodEntity();
    food.name = name;
    food.calorie = calorie;
    food.price = price;
    food.yearMonth = moment(createdAt).format('YYYY-MM');
    food.date = moment(createdAt).format('YYYY-MM-DD');
    food.time = moment(createdAt).format('HH:mm');
    food.userId = authUser.id;

    //if admin is creating a food item
    console.log({ authUser });
    let user: UserEntity = authUser;
    if (authUser.isAdmin && body.userId) {
      user = await UserEntity.findOne(body.userId);
      if (user) {
        food.userId = body.userId;
      } else throw new HttpException('Provided UserID is Invalid', 400);
    }

    await food.save();
    const dayFoods = await FoodEntity.find({
      where: { userId: food.userId, date: food.date },
    });
    const totalDayCalorie = dayFoods.reduce((total, f) => {
      return total + f.calorie;
    }, 0);
    return { food, totalDayCalorie, user };
  }

  async updateFood(
    id: string,
    body: { createdAt: string; name: string; calorie: number; price: number },
    authUser: UserEntity,
  ) {
    const food = await FoodEntity.findOne(id);
    if (food) {
      if (food.userId === authUser.id || authUser.isAdmin) {
        const { value, error } = validateFoodEntry(body);
        if (error) throw new HttpException(error.message, 400);
        const { createdAt, name, calorie, price } = value;
        food.name = name;
        food.calorie = calorie;
        food.price = price;
        food.yearMonth = moment(createdAt).format('YYYY-MM');
        food.date = moment(createdAt).format('YYYY-MM-DD');
        food.time = moment(createdAt).format('HH:mm');
        await food.save();
        return {
          food,
          message: 'Updated Successfully',
        };
      } else {
        throw new HttpException('Forbidden Access', 403);
      }
    } else throw new HttpException('Not found', 404);
  }

  async deleteFood(id: string, authUser: UserEntity) {
    const food = await FoodEntity.findOne(id);
    if (food) {
      if (food.userId === authUser.id || authUser.isAdmin) {
        await FoodEntity.delete(id);
        return { message: 'Deleted Successfully' };
      } else {
        throw new HttpException('Forbidden Access', 403);
      }
    } else throw new HttpException('Not found', 404);
  }

  async listFood(params, authUser: UserEntity) {
    const pageSize = 10;
    const { value, error } = validateFoodListing(params);
    if (error) throw new HttpException(error.message, 400);
    const { startDate, endDate, page } = value;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    if (startDate > endDate)
      throw new HttpException("From date can't be more than to date", 400);
    let foods: FoodEntity[];
    let totalFoodCount = 0;
    if (authUser?.isAdmin) {
      foods = await getRepository(FoodEntity)
        .createQueryBuilder('food')
        .where('food.date >= :startDate and food.date <= :endDate', {
          startDate,
          endDate,
        })
        .limit(take)
        .offset(skip)
        .getMany();

      totalFoodCount = await getRepository(FoodEntity)
        .createQueryBuilder('food')
        .where('food.date >= :startDate and food.date <= :endDate', {
          startDate,
          endDate,
        })
        .getCount();
    } else {
      foods = await FoodEntity.find({
        where: { date: Between(startDate, endDate), userId: authUser.id },
        order: { id: 'DESC' },
        skip,
        take,
      });
      totalFoodCount = await FoodEntity.count({
        where: { date: Between(startDate, endDate), userId: authUser.id },
      });
    }

    if (foods.length === 0) {
      return { foodItems: foods, currentPage: page, totalPages: 1 };
    }
    const userIds = _.uniq(foods.map((f) => f.userId));
    const minDate = _.min(foods.map((f) => f.date));
    const maxDate = _.max(foods.map((f) => f.date));
    const minYearMonth = _.min(foods.map((f) => f.yearMonth));
    const maxYearMonth = _.max(foods.map((f) => f.yearMonth));

    const calorieSumGroup = await getManager().query(`
            select userId, date, sum(calorie) as dayTotalCalorie from 
            food where date BETWEEN '${minDate}' and '${maxDate}'
            and userId in (${userIds.join(',')}) 
            group by userId, date`);
    const amountSumGroup = await getManager().query(`
              select userId, yearMonth, sum(price) as monthlyPrice from 
              food where yearMonth BETWEEN '${minYearMonth}' and '${maxYearMonth}'
              and userId in (${userIds.join(',')}) 
              group by userId, yearMonth`);

    const calorieSumGroupMap = {};
    const amountSumGroupMap = {};
    for (const calorieSum of calorieSumGroup) {
      calorieSumGroupMap[`${calorieSum.userId}-${calorieSum.date}`] =
        calorieSum.dayTotalCalorie;
    }
    for (const amountSum of amountSumGroup) {
      amountSumGroupMap[`${amountSum.userId}-${amountSum.yearMonth}`] =
        amountSum.monthlyPrice;
    }

    const users = await UserEntity.find({ where: { id: In(userIds) } });
    for (const food of foods) {
      const calorieKey = `${food.userId}-${food.date}`;
      const amountKey = `${food.userId}-${food.yearMonth}`;
      // @ts-ignore
      food.dayCalorie = calorieSumGroupMap[calorieKey];
      // @ts-ignore
      food.monthAmount = amountSumGroupMap[amountKey];
      // @ts-ignore
      food.createdAt = food.date + ' ' + food.time;
      for (const user of users) {
        if (user.id === food.userId) {
          // @ts-ignore
          food.user = user;
        }
      }
    }
    const totalPage = Math.ceil(totalFoodCount / pageSize);
    return { foodItems: foods, currentPage: page, totalPages: totalPage };
  }

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
