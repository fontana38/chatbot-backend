import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MenuService } from '../../Aplication/services/menu.service';
import { CreateMenuDto } from '../dto/create-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('cargar-menu')
  async cargarMenu(@Body() dto: CreateMenuDto) {
    return this.menuService.createMenu(dto);
  }

  @Get()
  async getAllMenu() {
    return this.menuService.getAllMenu();
  }

  @Get(':code')
  async getMenuByCode(@Param('code') code: string) {
    return this.menuService.getMenuByCode(code);
  }
}