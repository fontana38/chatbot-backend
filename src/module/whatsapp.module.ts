import { Module } from '@nestjs/common';
import { WhatsAppService } from 'src/Aplication/services/whatsapp.service';


@Module({
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}