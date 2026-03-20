import { Module } from '@nestjs/common';
import { WebhookController } from 'src/Infraestructura/controller/webhook.controller';
import { WebhookService } from 'src/Aplication/services/webhook.service';
import { ChatbotModule } from './chatbot.module';
import { WhatsAppModule } from './whatsapp.module';
import { ContactModule } from './contact.module';
import { ConversationModule } from './conversation.module';


@Module({
  imports: [
    ChatbotModule,
    WhatsAppModule,
    ContactModule,
    ConversationModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}