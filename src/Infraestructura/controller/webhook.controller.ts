import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { WebhookService } from 'src/Aplication/services/webhook.service';


@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const VERIFY_TOKEN = 'test';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return challenge;
    }

    throw new ForbiddenException('Token inválido');
  }

  @Post()
  async receiveMessage(@Body() body: any) {
    console.log('mensaje',body)
    await this.webhookService.processIncoming(body);

    return 'EVENT_RECEIVED';
  }
}