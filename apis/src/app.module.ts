import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import User from './db/entity/user.entity';
import Food from './db/entity/food.entity';

import FoodController from './controller/food-controller';
import UserController from './controller/user-controller';

import FoodService from './service/food-service';
import UserService from './service/user-service';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/data.db',
      entities: [User, Food],
      synchronize: true,
      logging: 'all',
    }),
  ],
  controllers: [FoodController, UserController],
  providers: [FoodService, UserService],
})
export default class AppModule {}
