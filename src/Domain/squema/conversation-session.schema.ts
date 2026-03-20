import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationSessionDocument = HydratedDocument<ConversationSession>;

@Schema({ _id: false })
export class ConversationSummary {
  @Prop({ type: String })
  lastUserMessage?: string;

  @Prop({ type: String })
  lastBotMessage?: string;

  @Prop({ type: Number, default: 0 })
  messageCount: number;
}

export const ConversationSummarySchema =
  SchemaFactory.createForClass(ConversationSummary);

@Schema({
  collection: 'conversation_sessions',
  timestamps: true,
})
export class ConversationSession {
  @Prop({ type: Types.ObjectId, ref: 'Contact', required: true, index: true })
  contactId: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  phoneNumber: string;

  @Prop({ type: String, default: 'open', index: true })
  sessionStatus: 'open' | 'closed' | 'transferred';

  @Prop({ type: Date, required: true, default: () => new Date() })
  startedAt: Date;

  @Prop({ type: Date, default: null })
  endedAt?: Date | null;

  @Prop({ type: Date, required: true, default: () => new Date(), index: true })
  lastMessageAt: Date;

  @Prop({ type: String, default: 'bot' })
  sessionType: 'bot' | 'human' | 'hybrid';

  @Prop({ type: String, default: 'whatsapp' })
  channel: string;

  @Prop({ type: String })
  entryPoint?: string;

  @Prop({ type: String, default: 'start' })
  currentNode?: string;

  @Prop({ type: Object, default: {} })
  context?: Record<string, any>;

  @Prop({ type: ConversationSummarySchema, default: {} })
  summary?: ConversationSummary;
}

export const ConversationSessionSchema =
  SchemaFactory.createForClass(ConversationSession);

ConversationSessionSchema.index({ contactId: 1, startedAt: -1 });
ConversationSessionSchema.index({ phoneNumber: 1, startedAt: -1 });
ConversationSessionSchema.index({ sessionStatus: 1, lastMessageAt: -1 });