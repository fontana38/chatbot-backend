import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotMessageDto } from 'src/Infraestructura/dto/chatbot-message.dto';
import { ChatbotService } from 'src/Aplication/services/chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  
@Post('message')
async sendMessage(@Body() dto: ChatbotMessageDto) {
  console.log('hola')
  return this.chatbotService.processMessage(dto);
}

}
