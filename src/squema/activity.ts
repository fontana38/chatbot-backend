import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ _id: false })
export class ActivitySchedule {
  @Prop({ required: true })
  days: string;

  @Prop({ required: true })
  time: string;

  @Prop()
  ages?: string;

  @Prop()
  type?: string;
}

export const ActivityScheduleSchema =
  SchemaFactory.createForClass(ActivitySchedule);

@Schema({ collection: 'activity', timestamps: true })
export class Activity {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, unique: true })
  menuOption: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  category?: string;

  @Prop()
  description?: string;

  @Prop()
  location?: string;

  @Prop()
  start?: string;

  @Prop()
  inscription?: string;

  @Prop()
  price?: string;

  @Prop({ type: [String], default: [] })
  prices: string[];

  @Prop({ type: [String], default: [] })
  siblingsPrices: string[];

  @Prop({ type: [String], default: [] })
  benefits: string[];

  @Prop()
  instructor?: string;

  @Prop()
  contactPhone?: string;

  @Prop({ type: [ActivityScheduleSchema], default: [] })
  schedules: ActivitySchedule[];
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);