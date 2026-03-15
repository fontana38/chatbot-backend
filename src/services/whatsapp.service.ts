import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsAppService {
  async sendTextMessage(to: string, body: string): Promise<void> {
    await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: {
          body,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}