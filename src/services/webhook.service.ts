import { Injectable } from "@nestjs/common";
import { ChatbotService } from "./chatbot.service";
import { WhatsAppService } from "./whatsapp.service";
import { normalizeArgPhone } from "src/helper/formatter.celnumber";


@Injectable()
export class WebhookService {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly whatsAppService: WhatsAppService,
  ) {}

  async processIncoming(body: any): Promise<void> {
  const incomingMessage =
    body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!incomingMessage) return;

  if (incomingMessage.type !== 'text') return;

  const from = incomingMessage.from;
  console.log('from', from);

  const message = incomingMessage.text?.body;

  if (!from || !message) return;

  const result = await this.chatbotService.processMessage({
    userId: from,
    message,
  });
if (result?.response) {
  // Si el número tiene 13 dígitos y es de Argentina con el 9 (549...), 
  // lo transformamos al formato de 12 dígitos (54...) que Meta acepta.
  const to = (from.startsWith('549') && from.length === 13) 
    ? '54' + from.slice(3) 
    : from;
  await this.whatsAppService.sendTextMessage(to, result.response);
  }
}}