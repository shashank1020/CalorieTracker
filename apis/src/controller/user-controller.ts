import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import AppGuard from '..//guard/app-guard';

@Controller('/user')
@UseGuards(AppGuard)
export default class UserController {
  @Get('/details')
  getUserDetails(@Req() req) {
    return { user: req.user };
  }
}
