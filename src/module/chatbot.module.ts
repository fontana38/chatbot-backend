import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatbotController } from 'src/controller/chatbot.controller';
import { ChatbotService } from 'src/services/chatbot.service';
import { Activity, ActivitySchema } from 'src/squema/activity';
import { ChatNode, ChatNodeSchema } from 'src/squema/chat.squema';
import { ActivityModule } from './activity.module';
import { MenuModule } from './menu.module';
import { ConversationModule } from './conversation.module';


@Module({
  imports: [ActivityModule, MenuModule, ConversationModule],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}