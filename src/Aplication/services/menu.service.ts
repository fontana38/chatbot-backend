import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMenuDto } from '../../Infraestructura/dto/create-menu.dto';
import { Menu, MenuDocument } from 'src/Domain/squema/menu.squema';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name)
    private readonly menuModel: Model<MenuDocument>,
  ) {}

  async createMenu(dto: CreateMenuDto) {
    const existing = await this.menuModel.findOne({ code: dto.code });

    if (existing) {
      return {
        message: `Ya existe un menú con el código ${dto.code}`,
        menu: existing,
      };
    }

    const created = await this.menuModel.create(dto);

    return {
      message: 'Menú creado correctamente',
      menu: created,
    };
  }

  async getAllMenu() {
    return this.menuModel.find().sort({ code: 1 }).lean();
  }

  async getMenuByCode(code: string) {
    return this.menuModel.findOne({ code }).lean();
  }
}