import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityController } from 'src/Infraestructura/controller/activity.controller';
import { ActivityService } from 'src/Aplication/services/activity.service';
import { Activity, ActivitySchema } from 'src/Domain/squema/activity';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
    controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}