import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from 'src/squema/conversation.squema';


@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
  ) {}

  async getOrCreate(userId: string) {
    let conversation = await this.conversationModel.findOne({ userId });

    if (!conversation) {
      conversation = await this.conversationModel.create({
        userId,
        currentStep: 'MAIN_MENU',
        selectedMenuCode: 'main_menu',
      });
    }

    return conversation;
  }

  async updateConversation(
    userId: string,
    data: Partial<Conversation>,
  ) {
    return this.conversationModel.findOneAndUpdate(
      { userId },
      { ...data },
      { new: true, upsert: true },
    );
  }

  async resetConversation(userId: string) {
    return this.conversationModel.findOneAndUpdate(
      { userId },
      {
        currentStep: 'MAIN_MENU',
        selectedMenuCode: 'main_menu',
        selectedActivityCode: null,
        context: {},
      },
      { new: true, upsert: true },
    );
  }
}