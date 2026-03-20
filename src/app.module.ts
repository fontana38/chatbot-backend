import { ConfigModule, ConfigService } from "@nestjs/config";
import { ChatbotModule } from "./module/chatbot.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { ChatbotService } from "./Aplication/services/chatbot.service";
import { ActivityModule } from "./module/activity.module";
import { MenuModule } from "./module/menu.module";
import { WebhookModule } from "./module/webhook.module";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    ChatbotModule,
    ActivityModule,
    MenuModule,
    WebhookModule,
  ],
})
export class AppModule {}