import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConversationService } from '../services/conversation.service';
import { Conversation, ConversationSchema } from 'src/squema/conversation.squema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}