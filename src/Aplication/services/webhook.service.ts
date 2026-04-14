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
  const entries = body?.entry ?? [];

  for (const entry of entries) {
    const changes = entry?.changes ?? [];

    for (const change of changes) {
      const value = change?.value;

      const incomingMessage = value?.messages?.[0];
      const incomingStatus = value?.statuses?.[0];

      if (incomingStatus) {
        console.log('STATUS EVENT:', incomingStatus.status);
        continue;
      }

      if (!incomingMessage) {
        console.log('No vino mensaje en este change');
        continue;
      }

      console.log('incomingMessage', JSON.stringify(incomingMessage, null, 2));

      if (incomingMessage.type !== 'text') {
        console.log('Tipo no soportado:', incomingMessage.type);
        continue;
      }

      const from = incomingMessage.from;
      const message = incomingMessage.text?.body;

      if (!from || !message) {
        console.log('Falta from o message');
        continue;
      }

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

       if (session.sessionStatus === 'transferred') {
          console.log('Sesión en humano, el bot no responde');
          continue;
        }

      const result = await this.chatbotService.processMessage({
        contactId: contact._id.toString(),
        sessionId: session._id.toString(),
        message,
        currentNode: session.currentNode,
        context: session.context,
      });

      if (!result?.response) {
        continue;
      }

      await this.whatsAppService.sendTextMessage(
        contact.phoneNumber,
        result.response,
      );

      if (result.metadata?.transferToHuman) {
  await this.conversationSessionsService.transferToHuman(
    session._id.toString(),
    result.metadata?.reason,
  );
}

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
 }}