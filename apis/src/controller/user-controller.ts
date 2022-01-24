import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
// import { AppService } from './app.service';
import AppGuard from '..//guard/app-guard';
import UserService from '../service/food-service';

@Controller('/food')
@UseGuards(AppGuard)
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/reports')
  foodReports(@Req() req) {
    return this.userService.generateReports(req.user);
  }

  @Get('/user/details')
  getUserDetails(@Req() req) {
    return { user: req.user };
  }
}
