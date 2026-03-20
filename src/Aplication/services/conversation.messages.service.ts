import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConversationMessage, ConversationMessageDocument } from 'src/Domain/squema/conversation-message.schema';


type CreateInboundMessageParams = {
  contactId: string;
  sessionId: string;
  phoneNumber: string;
  text?: string;
  rawPayload?: Record<string, any>;
  providerMessageId?: string;
  metadata?: Record<string, any>;
  messageType?: 'text' | 'interactive' | 'image' | 'document' | 'system';
  messageTimestamp?: Date;
};

type CreateOutboundMessageParams = {
  contactId: string;
  sessionId: string;
  phoneNumber: string;
  text?: string;
  metadata?: Record<string, any>;
  rawPayload?: Record<string, any>;
  providerMessageId?: string;
  messageType?: 'text' | 'interactive' | 'image' | 'document' | 'system';
  messageTimestamp?: Date;
};

@Injectable()
export class ConversationMessagesService {
  constructor(
    @InjectModel(ConversationMessage.name)
    private readonly messageModel: Model<ConversationMessageDocument>,
  ) {}

  async createInbound(
    params: CreateInboundMessageParams,
  ): Promise<ConversationMessageDocument> {
    return this.messageModel.create({
      contactId: new Types.ObjectId(params.contactId),
      sessionId: new Types.ObjectId(params.sessionId),
      phoneNumber: params.phoneNumber,
      direction: 'inbound',
      messageType: params.messageType ?? 'text',
      text: params.text,
      metadata: params.metadata ?? {},
      rawPayload: params.rawPayload ?? {},
      providerMessageId: params.providerMessageId,
      messageTimestamp: params.messageTimestamp ?? new Date(),
    });
  }

  async createOutbound(
    params: CreateOutboundMessageParams,
  ): Promise<ConversationMessageDocument> {
    return this.messageModel.create({
      contactId: new Types.ObjectId(params.contactId),
      sessionId: new Types.ObjectId(params.sessionId),
      phoneNumber: params.phoneNumber,
      direction: 'outbound',
      messageType: params.messageType ?? 'text',
      text: params.text,
      metadata: params.metadata ?? {},
      rawPayload: params.rawPayload ?? {},
      providerMessageId: params.providerMessageId,
      messageTimestamp: params.messageTimestamp ?? new Date(),
    });
  }

  async getMessagesBySession(sessionId: string) {
    return this.messageModel
      .find({
        sessionId: new Types.ObjectId(sessionId),
      })
      .sort({ messageTimestamp: 1 });
  }

  async getMessagesByContact(contactId: string) {
    return this.messageModel
      .find({
        contactId: new Types.ObjectId(contactId),
      })
      .sort({ messageTimestamp: -1 });
  }
}