import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatbotController } from 'src/Infraestructura/controller/chatbot.controller';
import { ChatbotService } from 'src/Aplication/services/chatbot.service';
import { Activity, ActivitySchema } from 'src/Domain/squema/activity';
import { ChatNode, ChatNodeSchema } from 'src/Domain/squema/chat.squema';
import { ActivityModule } from './activity.module';
import { MenuModule } from './menu.module';
import { ConversationModule } from './conversation.module';

@Module({
  imports: [ActivityModule, MenuModule, ConversationModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}