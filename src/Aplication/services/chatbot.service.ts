import { Injectable } from '@nestjs/common';
import { MenuService } from './menu.service';
import { ActivityService } from './activity.service';

export type ProcessMessageParams = {
  contactId?: string;
  sessionId?: string;
  userId?: string;
  message: string;
  currentNode?: string;
  context?: Record<string, any>;
};

export type ChatbotResponse = {
  response: string;
  currentNode?: string;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
};

@Injectable()
export class ChatbotService {
  constructor(
    private readonly menuService: MenuService,
    private readonly activityService: ActivityService,
  ) {}

  async processMessage(
    params: ProcessMessageParams,
  ): Promise<ChatbotResponse> {
    const message = this.normalizeMessage(params.message);
    const context = params.context ?? {};

    if (!message || this.isGreeting(message)) {
      return this.buildMainMenuResponse(context);
    }

    if (message === 'menu' || message === 'inicio' || message === 'volver') {
      return this.buildMainMenuResponse(context);
    }

    const activity = await this.activityService.getByMenuOption(message);

    if (!activity) {
      const menu = await this.menuService.getMenuByCode('main_menu');

      if (!menu) {
        return {
          response: 'No encontré el menú principal configurado.',
          currentNode: 'main_menu',
          context,
          metadata: {
            error: 'main_menu_not_found',
          },
        };
      }

      return {
        response: this.formatMenu(menu, true),
        currentNode: 'main_menu',
        context,
        metadata: {
          type: 'menu',
          menuCode: 'main_menu',
          invalidOption: true,
        },
      };
    }

    return {
      response: this.formatActivity(activity),
      currentNode: 'main_menu',
      context: {
        ...context,
        selectedOption: message,
        selectedActivityCode: activity.code,
        selectedActivityName: activity.name,
      },
      metadata: {
        type: 'activity',
        menuOption: message,
        activityCode: activity.code,
      },
    };
  }

  private async buildMainMenuResponse(
    context: Record<string, any>,
  ): Promise<ChatbotResponse> {
    const menu = await this.menuService.getMenuByCode('main_menu');

    if (!menu) {
      return {
        response: 'No encontré el menú principal configurado.',
        currentNode: 'main_menu',
        context,
        metadata: {
          error: 'main_menu_not_found',
        },
      };
    }

    return {
      response: this.formatMenu(menu, false),
      currentNode: 'main_menu',
      context: {
        ...context,
        lastMenuCode: 'main_menu',
      },
      metadata: {
        type: 'menu',
        menuCode: 'main_menu',
      },
    };
  }

  private formatMenu(menu: any, invalidOption: boolean): string {
    const optionsText = (menu.options ?? [])
      .map((item: any) => `${item.option}. ${item.label}`)
      .join('\n');

    const prefix = invalidOption ? 'Opción inválida.\n\n' : '';

    return `${prefix}${menu.welcomeMessage}\n\n${optionsText}`;
  }

  private formatActivity(activity: any): string {
    const parts: string[] = [];

    if (activity.name) {
      parts.push(`*${activity.name}*`);
    }

    if (activity.description) {
      parts.push(activity.description);
    }

    if (activity.location) {
      parts.push(`Lugar: ${activity.location}`);
    }

    if (activity.start) {
      parts.push(`Inicio: ${activity.start}`);
    }

    if (activity.instructor) {
      parts.push(`Instructor/a: ${activity.instructor}`);
    }

    if (activity.inscription) {
      parts.push(`Inscripción: ${activity.inscription}`);
    }

    if (activity.price) {
      parts.push(`Precio: ${activity.price}`);
    }

    if (Array.isArray(activity.prices) && activity.prices.length > 0) {
      const pricesText = activity.prices
        .map((price: string) => `- ${price}`)
        .join('\n');

      parts.push(`Precios:\n${pricesText}`);
    }

    if (
      Array.isArray(activity.siblingsPrices) &&
      activity.siblingsPrices.length > 0
    ) {
      const siblingsPricesText = activity.siblingsPrices
        .map((price: string) => `- ${price}`)
        .join('\n');

      parts.push(`Precios para hermanos:\n${siblingsPricesText}`);
    }

    if (Array.isArray(activity.benefits) && activity.benefits.length > 0) {
      const benefitsText = activity.benefits
        .map((benefit: string) => `- ${benefit}`)
        .join('\n');

      parts.push(`Beneficios:\n${benefitsText}`);
    }

    if (Array.isArray(activity.schedules) && activity.schedules.length > 0) {
      const schedulesText = activity.schedules
        .map((schedule: any) => this.formatSchedule(schedule))
        .filter(Boolean)
        .join('\n');

      parts.push(`Horarios:\n${schedulesText}`);
    }

    if (activity.contactPhone) {
      parts.push(`Contacto: ${activity.contactPhone}`);
    }

    parts.push('Escribí "menu" para volver al inicio.');

    return parts.join('\n\n');
  }

  private formatSchedule(schedule: any): string {
    if (!schedule) return '';

    if (typeof schedule === 'string') {
      return `- ${schedule}`;
    }

    const values: string[] = [];

    if (schedule.days) values.push(schedule.days);
    if (schedule.time) values.push(schedule.time);
    if (schedule.ages) values.push(`Edad: ${schedule.ages}`);
    if (schedule.type) values.push(`Grupo: ${schedule.type}`);

    if (values.length === 0) {
      return '';
    }

    return `- ${values.join(' | ')}`;
  }

  private normalizeMessage(message: string): string {
    return (message ?? '')
      .trim()
      .replace(/\./g, '')
      .replace(/-/g, '');
  }

  private isGreeting(message: string): boolean {
    const normalized = message.toLowerCase();

    return [
      'hola',
      'buenas',
      'buen dia',
      'buen día',
      'hello',
      'hi',
    ].includes(normalized);
  }
}