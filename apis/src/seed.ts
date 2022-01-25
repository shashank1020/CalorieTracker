import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';

import * as Fs from 'fs';
import * as Faker from 'faker';
import * as _ from 'lodash';

import UserEntity from '../src/db/entity/user.entity';
import FoodEntity from '../src/db/entity/food.entity';

import * as moment from 'moment';

const bootstrap = async () => {
  try {
    await Fs.unlinkSync('src/db/data.db');
  } catch (e) {}
  const app = await NestFactory.createApplicationContext(AppModule);
  for (let i = 0; i < 20; i++) {
    const user = new UserEntity();
    user.id = i + 1;
    user.name = Faker.name.findName();
    user.isAdmin = user.id % 5 === 0;
    await user.save();
  }
  const users = await UserEntity.find({});
  for (let i = 0; i < 1000; i++) {
    const d = moment().subtract(Math.ceil(Math.random() * 100), 'day');
    const food = new FoodEntity();
    // food.name = Faker.commerce.productName();
    food.name = 'Random Name ' + i;
    food.date = d.format('YYYY-MM-DD');
    food.yearMonth = d.format('YYYY-MM');
    food.time = d.format('HH:mm');
    food.calorie = Math.ceil(Math.random() * 1000);
    food.price = Math.ceil(Math.random() * 100);
    food.userId = _.sample(users).id;
    console.log({ food });
    await food.save();
  }
};

bootstrap();
