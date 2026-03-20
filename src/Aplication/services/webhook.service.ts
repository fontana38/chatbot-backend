import { Injectable } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { WhatsAppService } from './whatsapp.service';
import { ContactsService } from './contact.service';

import { ConversationMessagesService } from './conversation.messages.service';
import { ConversationSessionsService } from './conversation.session.service';


@Injectable()
export class WebhookService {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly whatsAppService: WhatsAppService,
    private readonly contactsService: ContactsService,
    private readonly conversationSessionsService: ConversationSessionsService,
    private readonly conversationMessagesService: ConversationMessagesService,
  ) {}

  async processIncoming(body: any): Promise<void> {
    const incomingMessage =
      body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!incomingMessage) return;
    if (incomingMessage.type !== 'text') return;

    const from = incomingMessage.from;
    const message = incomingMessage.text?.body;

    if (!from || !message) return;

    const contact = await this.contactsService.findOrCreateByPhone(from);

    const session =
      await this.conversationSessionsService.findOrCreateActiveSession({
        contactId: contact._id.toString(),
        phoneNumber: contact.phoneNumber,
      });

    await this.conversationMessagesService.createInbound({
      contactId: contact._id.toString(),
      sessionId: session._id.toString(),
      phoneNumber: contact.phoneNumber,
      text: message,
      rawPayload: incomingMessage,
      providerMessageId: incomingMessage.id,
      messageTimestamp: new Date(),
    });

    const result = await this.chatbotService.processMessage({
      contactId: contact._id.toString(),
      sessionId: session._id.toString(),
      message,
      currentNode: session.currentNode,
      context: session.context,
    });

    if (!result?.response) return;

    await this.whatsAppService.sendTextMessage(
      contact.phoneNumber,
      result.response,
    );

    await this.conversationMessagesService.createOutbound({
      contactId: contact._id.toString(),
      sessionId: session._id.toString(),
      phoneNumber: contact.phoneNumber,
      text: result.response,
      metadata: result.metadata,
      messageTimestamp: new Date(),
    });

    await this.conversationSessionsService.updateAfterInteraction(
      session._id.toString(),
      {
        currentNode: result.currentNode,
        context: result.context,
        lastUserMessage: message,
        lastBotMessage: result.response,
      },
    );

    await this.contactsService.touch(contact._id.toString());
  }
}