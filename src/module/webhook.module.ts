import { Module } from '@nestjs/common';
import { WebhookController } from 'src/controller/webhook.controller';
import { WebhookService } from 'src/services/webhook.service';
import { ChatbotModule } from './chatbot.module';
import { WhatsAppModule } from './whatsapp.module';


@Module({
  imports: [ChatbotModule, WhatsAppModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}