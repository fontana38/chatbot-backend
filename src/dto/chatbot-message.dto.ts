import { IsNotEmpty, IsString } from 'class-validator';


export class ChatbotMessageDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  message: string;
}