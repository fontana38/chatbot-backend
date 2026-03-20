import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatNodeDocument = ChatNode & Document;

@Schema({ _id: false })
export class ChatOption {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  nextNodeId: string;
}

export const ChatOptionSchema = SchemaFactory.createForClass(ChatOption);

@Schema({ collection: 'chat_nodes', timestamps: true })
export class ChatNode {
  @Prop({ required: true, unique: true })
  nodeId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: [ChatOptionSchema], default: [] })
  options: ChatOption[];

  @Prop({ default: false })
  isStart: boolean;
}

export const ChatNodeSchema = SchemaFactory.createForClass(ChatNode);