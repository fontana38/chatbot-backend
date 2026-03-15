import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotMessageDto } from 'src/dto/chatbot-message.dto';
import { ChatbotService } from 'src/services/chatbot.service';
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  
@Post('message')
async sendMessage(@Body() dto: ChatbotMessageDto) {
  return this.chatbotService.processMessage(dto);
}

}
