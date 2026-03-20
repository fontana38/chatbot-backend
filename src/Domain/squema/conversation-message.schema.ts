import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationMessageDocument = HydratedDocument<ConversationMessage>;

@Schema({
  collection: 'conversation_messages',
  timestamps: true,
})
export class ConversationMessage {
  @Prop({ type: Types.ObjectId, ref: 'Contact', required: true, index: true })
  contactId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'ConversationSession',
    required: true,
    index: true,
  })
  sessionId: Types.ObjectId;

  @Prop({ required: true, index: true })
  phoneNumber: string;

  @Prop({ required: true })
  direction: 'inbound' | 'outbound';

  @Prop({ default: 'text' })
  messageType: 'text' | 'interactive' | 'image' | 'document' | 'system';

  @Prop()
  text?: string;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;

  @Prop({ type: Object, default: {} })
  rawPayload?: Record<string, any>;

  @Prop()
  providerMessageId?: string;

  @Prop({ required: true, default: () => new Date(), index: true })
  messageTimestamp: Date;
}

export const ConversationMessageSchema =
  SchemaFactory.createForClass(ConversationMessage);

ConversationMessageSchema.index({ sessionId: 1, messageTimestamp: 1 });
ConversationMessageSchema.index({ contactId: 1, messageTimestamp: -1 });
ConversationMessageSchema.index(
  { providerMessageId: 1 },
  { unique: true, sparse: true },
);