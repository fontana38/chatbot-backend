
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConversationSession,
  ConversationSessionSchema,
} from 'src/Domain/squema/conversation-session.schema';
import { ConversationMessage, ConversationMessageSchema } from 'src/Domain/squema/conversation-message.schema';
import { ConversationSessionsService } from 'src/Aplication/services/conversation.session.service';
import { ConversationMessagesService } from 'src/Aplication/services/conversation.messages.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConversationSession.name, schema: ConversationSessionSchema },
      { name: ConversationMessage.name, schema: ConversationMessageSchema },
    ]),
  ],
  providers: [
    ConversationSessionsService,
    ConversationMessagesService,
  ],
  exports: [
    ConversationSessionsService,
    ConversationMessagesService,
  ],
})
export class ConversationModule {}