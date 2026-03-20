import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConversationSession, ConversationSessionDocument } from 'src/Domain/squema/conversation-session.schema';

 

type FindOrCreateActiveSessionParams = {
  contactId: string;
  phoneNumber: string;
  expirationMinutes?: number;
};

type UpdateAfterInteractionParams = {
  currentNode?: string;
  context?: Record<string, any>;
  lastUserMessage?: string;
  lastBotMessage?: string;
};

@Injectable()
export class ConversationSessionsService {
  constructor(
    @InjectModel(ConversationSession.name)
    private readonly sessionModel: Model<ConversationSessionDocument>,
  ) {}

  async createSession(params: {
    contactId: string;
    phoneNumber: string;
    entryPoint?: string;
    currentNode?: string;
    context?: Record<string, any>;
  }): Promise<ConversationSessionDocument> {
    const now = new Date();

    return this.sessionModel.create({
      contactId: new Types.ObjectId(params.contactId),
      phoneNumber: params.phoneNumber,
      sessionStatus: 'open',
      startedAt: now,
      endedAt: null,
      lastMessageAt: now,
      sessionType: 'bot',
      channel: 'whatsapp',
      entryPoint: params.entryPoint ?? 'incoming_message',
      currentNode: params.currentNode ?? 'start',
      context: params.context ?? {},
      summary: {
        messageCount: 0,
      },
    });
  }

  async findLatestOpenSession(
    contactId: string,
  ): Promise<ConversationSessionDocument | null> {
    return this.sessionModel
      .findOne({
        contactId: new Types.ObjectId(contactId),
        sessionStatus: 'open',
      })
      .sort({ lastMessageAt: -1 });
  }

  isExpired(session: ConversationSessionDocument, expirationMinutes = 30): boolean {
    const now = new Date();
    const lastMessageAt = new Date(session.lastMessageAt);

    const diffMs = now.getTime() - lastMessageAt.getTime();
    const diffMinutes = diffMs / 1000 / 60;

    return diffMinutes > expirationMinutes;
  }

  async closeSession(sessionId: string): Promise<void> {
    const now = new Date();

    await this.sessionModel.updateOne(
      { _id: sessionId },
      {
        $set: {
          sessionStatus: 'closed',
          endedAt: now,
          lastMessageAt: now,
        },
      },
    );
  }

  async findOrCreateActiveSession(
    params: FindOrCreateActiveSessionParams,
  ): Promise<ConversationSessionDocument> {
    const expirationMinutes = params.expirationMinutes ?? 30;

    const openSession = await this.findLatestOpenSession(params.contactId);

    if (!openSession) {
      return this.createSession({
        contactId: params.contactId,
        phoneNumber: params.phoneNumber,
      });
    }

    if (this.isExpired(openSession, expirationMinutes)) {
      await this.closeSession(openSession._id.toString());

      return this.createSession({
        contactId: params.contactId,
        phoneNumber: params.phoneNumber,
      });
    }

    return openSession;
  }

  async updateAfterInteraction(
    sessionId: string,
    params: UpdateAfterInteractionParams,
  ): Promise<void> {
    const setData: Record<string, any> = {
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    };

    if (params.currentNode !== undefined) {
      setData.currentNode = params.currentNode;
    }

    if (params.context !== undefined) {
      setData.context = params.context;
    }

    const incData: Record<string, number> = {
      'summary.messageCount': 1,
    };

    if (params.lastUserMessage !== undefined) {
      setData['summary.lastUserMessage'] = params.lastUserMessage;
    }

    if (params.lastBotMessage !== undefined) {
      setData['summary.lastBotMessage'] = params.lastBotMessage;
    }

    await this.sessionModel.updateOne(
      { _id: sessionId },
      {
        $set: setData,
        $inc: incData,
      },
    );
  }

  async getSessionsByPhoneNumber(phoneNumber: string) {
    return this.sessionModel
      .find({ phoneNumber })
      .sort({ startedAt: -1 });
  }
}