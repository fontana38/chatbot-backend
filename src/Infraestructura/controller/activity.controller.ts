import { Controller, Get, Param, Post } from '@nestjs/common';
import { ActivityService } from 'src/Aplication/services/activity.service';


@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('seed')
  async seed() {
    return this.activityService.seedActivities();
  }

  @Get()
  async getAll() {
    return this.activityService.getAll();
  }

  @Get(':menuOption')
  async getByMenuOption(@Param('menuOption') menuOption: string) {
    return this.activityService.getByMenuOption(menuOption);
  }
}