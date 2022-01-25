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
import AppGuard from '../guard/app-guard';

import FoodService from '../service/food-service';
@Controller('/food')
@UseGuards(AppGuard)
export default class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('/')
  createFood(@Body() body, @Req() req) {
    console.log('body', body);
    return this.foodService.createFood(body, req.user);
  }

  @Get('/reports')
  foodReports(@Req() req) {
    return this.foodService.generateReports(req.user);
  }

  @Put('/:id')
  updateFood(@Param('id') id: string, @Body() body, @Req() req) {
    return this.foodService.updateFood(id, body, req.user);
  }

  @Delete('/:id')
  deleteFood(@Param('id') id: string, @Req() req) {
    return this.foodService.deleteFood(id, req.user);
  }

  @Get('/')
  listFood(@Query() queryParams, @Req() req) {
    return this.foodService.listFood(queryParams, req.user);
  }
}
