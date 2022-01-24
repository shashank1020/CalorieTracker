import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import AppGuard from '..//guard/app-guard';
import UserService from '../service/user-service';

@Controller('/user')
@UseGuards(AppGuard)
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/reports')
  foodReports(@Req() req) {
    return this.userService.generateReports(req.user);
  }

  @Get('/details')
  getUserDetails(@Req() req) {
    return { user: req.user };
  }
}
