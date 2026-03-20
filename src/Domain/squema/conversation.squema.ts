import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, default: 'MAIN_MENU' })
  currentStep: string;

  @Prop({ default: 'main_menu' })
  selectedMenuCode?: string;

  @Prop()
  selectedActivityCode?: string;

  @Prop()
  lastMessage?: string;

  @Prop({ type: Object, default: {} })
  context?: Record<string, any>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);