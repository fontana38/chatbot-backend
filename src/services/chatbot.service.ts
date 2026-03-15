import { Injectable } from '@nestjs/common';
import { ChatbotMessageDto } from '../dto/chatbot-message.dto';
import { ActivityService } from './activity.service';
import { MenuService } from './menu.service';
import { ConversationService } from './conversation.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly activityService: ActivityService,
    private readonly menuService: MenuService,
    private readonly conversationService: ConversationService,
  ) {}

  async processMessage(dto: ChatbotMessageDto) {
    
    const userId = dto.userId;
    const message = dto?.message?.trim().toLowerCase() || '';

    const conversation = await this.conversationService.getOrCreate(userId);

    if (!message || ['hola', 'menu', 'menú', 'inicio'].includes(message)) {
      await this.conversationService.resetConversation(userId);

      return {
        response: await this.buildMenuMessage('main_menu'),
      };
    }

    if (conversation.currentStep === 'MAIN_MENU') {
      return this.handleMainMenuSelection(userId, message);
    }

    if (conversation.currentStep === 'VIEWING_ACTIVITY') {
      if (message === 'volver') {
        await this.conversationService.resetConversation(userId);

        return {
          response: await this.buildMenuMessage('main_menu'),
        };
      }

      if (message === 'inscribirme') {
        await this.conversationService.updateConversation(userId, {
          currentStep: 'ASKING_NAME',
          lastMessage: message,
        });

        return {
          response: 'Perfecto. ¿Me decís tu nombre y apellido?',
        };
      }

      return {
        response:
          'Podés escribir "inscribirme" o "volver" para regresar al menú.',
      };
    }

    if (conversation.currentStep === 'ASKING_NAME') {
      await this.conversationService.updateConversation(userId, {
        currentStep: 'ASKING_PHONE',
        context: {
          ...conversation.context,
          fullName: dto.message,
        },
        lastMessage: dto.message,
      });

      return {
        response: 'Gracias. Ahora pasame tu teléfono.',
      };
    }

    if (conversation.currentStep === 'ASKING_PHONE') {
      await this.conversationService.updateConversation(userId, {
        currentStep: 'FINISHED',
        context: {
          ...conversation.context,
          phone: dto.message,
        },
        lastMessage: dto.message,
      });

      return {
        response:
          'Perfecto, ya tengo tus datos. En breve se contactarán con vos.',
      };
    }

    return {
      response: 'No entendí tu mensaje. Escribí "menu" para empezar de nuevo.',
    };
  }

  private async handleMainMenuSelection(userId: string, message: string) {
    const menu = await this.menuService.getMenuByCode('main_menu');

    if (!menu) {
      return {
        response: 'No hay menú configurado.',
      };
    }

    const selectedOption = menu.options.find(
      (option) => option.option === message,
    );

    if (!selectedOption) {
      return {
        response:
          'No encontré esa opción.\n\n' +
          (await this.buildMenuMessage('main_menu')),
      };
    }

    if (selectedOption.targetType === 'activity') {
      const activity = await this.activityService.getByMenuOption(
        selectedOption.targetValue,
      );

      if (!activity) {
        return {
          response: 'La actividad seleccionada no existe.',
        };
      }

      await this.conversationService.updateConversation(userId, {
        currentStep: 'VIEWING_ACTIVITY',
        selectedMenuCode: 'main_menu',
        selectedActivityCode: activity.code,
        lastMessage: message,
      });

      return {
        response: this.buildActivityMessage(activity),
      };
    }

    return {
      response: 'La opción elegida todavía no está implementada.',
    };
  }

  private async buildMenuMessage(code: string): Promise<string> {
    const menu = await this.menuService.getMenuByCode(code);

    if (!menu) {
      return 'No hay menú configurado.';
    }

    const options = menu.options
      .map((opt) => `${opt.option}. ${opt.label}`)
      .join('\n');

    return `${menu.welcomeMessage}\n\n${options}`;
  }

  private buildActivityMessage(activity: any): string {
    const prices =
      activity.prices?.length > 0
        ? activity.prices.map((p: string) => `- ${p}`).join('\n')
        : activity.price
          ? `- ${activity.price}`
          : 'Sin precios informados';

    const schedules =
      activity.schedules?.length > 0
        ? activity.schedules
            .map((s: any) => {
              let text = `- ${s.days}`;
              if (s.time) text += ` | ${s.time}`;
              if (s.ages) text += ` | ${s.ages}`;
              if (s.type) text += ` | ${s.type}`;
              return text;
            })
            .join('\n')
        : 'Sin horarios';

    return (
      `${activity.name}\n\n` +
      `${activity.description ?? ''}\n\n` +
      `${activity.inscription ? `Inscripción: ${activity.inscription}\n` : ''}` +
      `Precios:\n${prices}\n\n` +
      `Horarios:\n${schedules}\n\n` +
      `Escribí "inscribirme" si querés dejar tus datos o "volver" para regresar al menú.`
    );
  }
}