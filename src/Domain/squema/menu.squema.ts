import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuDocument = Menu & Document;

@Schema({ _id: false })
export class MenuOption {
  @Prop({ required: true })
  option: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  targetType: string;

  @Prop({ required: true })
  targetValue: string;
}

export const MenuOptionSchema = SchemaFactory.createForClass(MenuOption);

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  welcomeMessage: string;

  @Prop({ type: [MenuOptionSchema], default: [] })
  options: MenuOption[];
}

export const MenuSchema = SchemaFactory.createForClass(Menu);