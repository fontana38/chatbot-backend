import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuService } from '../Aplication/services/menu.service';
import { Menu, MenuSchema } from 'src/Domain/squema/menu.squema';
import { MenuController } from 'src/Infraestructura/controller/menu.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}