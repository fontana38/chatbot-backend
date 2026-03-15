import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from 'src/squema/activity';


@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<ActivityDocument>,
  ) {}

  async seedActivities() {
    const activities = [
      {
        code: 'acrobacia_tela',
        menuOption: '1',
        name: 'Acrobacia en tela',
        category: 'aereas',
        description:
          'Actividad de acrobacia aérea en telas que desarrolla fuerza, coordinación y control corporal.',
        inscription:
          'Inscripción febrero 2026: $25.000 (se reconocen $10.000 en la cuota de marzo)',
        prices: [
          '1 vez por semana: $40.000',
          '2 veces por semana: $50.000',
          '3 veces por semana: $60.000',
        ],
        siblingsPrices: [
          '1 vez por semana: $70.000 total por hermanos',
          '2 veces por semana: $80.000 total por hermanos',
          '3 veces por semana: $90.000 total por hermanos',
        ],
        schedules: [
          {
            days: 'Martes, Jueves y Viernes',
            time: '17:00 a 18:30',
            ages: '5 a 7 años',
          },
        ],
      },
      {
        code: 'jam_jam',
        menuOption: '2',
        name: 'Jam Jam – Desafíos Aéreos',
        category: 'aereas',
        description:
          'Circuitos de desafíos aéreos a baja altura adaptados por edad. Mejora postura, fortalece el tren superior y desarrolla habilidades motoras.',
        location: 'Domo',
        inscription: '$15.000',
        prices: [
          '1 vez por semana: $40.000',
          '2 veces por semana: $50.000',
          '3 veces por semana: $60.000',
        ],
        schedules: [
          {
            days: 'Martes y Jueves',
            time: '17:00 a 18:30',
            ages: '4 a 6 años',
          },
          {
            days: 'Martes y Jueves',
            time: '18:30 a 20:00',
            ages: '7 a 12 años',
          },
        ],
      },
      {
        code: 'desarrollo_motor',
        menuOption: '3',
        name: 'Desarrollo Motor',
        category: 'entrenamiento',
        description:
          'Actividad enfocada en el desarrollo físico y coordinación motriz.',
        prices: [
          '1 vez por semana: $35.000',
          '2 veces por semana: $45.000',
          '3 veces por semana: $50.000',
        ],
        siblingsPrices: [
          '2 hermanos 1 vez por semana: $50.000',
          '2 hermanos 2 veces por semana: $65.000',
          '2 hermanos 3 veces por semana: $75.000',
        ],
        schedules: [
          {
            days: 'Lunes y Miércoles',
            time: '18:00 a 20:00',
          },
        ],
      },
      {
        code: 'futbol',
        menuOption: '4',
        name: 'Escuela de Fútbol Infantil',
        category: 'deportes',
        description:
          'Escuela de fútbol para niños con formación técnica y recreativa.',
        start: 'Marzo',
        prices: ['Matrícula: $30.000', 'Cuota mensual: $60.000'],
        benefits: ['Incluye conjunto deportivo válido por el mes de marzo'],
        schedules: [
          {
            days: 'Martes y Jueves',
            time: '16:30 a 18:00',
            ages: '4 a 7 años',
          },
          {
            days: 'Lunes y Miércoles',
            time: '16:30 a 18:00',
            ages: '8 a 13 años',
          },
          {
            days: 'Lunes y Miércoles',
            time: '18:00 a 19:30',
            ages: 'Cupo femenino',
          },
        ],
      },
      {
        code: 'padel',
        menuOption: '5',
        name: 'Escuela de Pádel',
        category: 'deportes',
        description:
          'Entrenamiento con una hora de pádel y 30 minutos de preparación física.',
        start: '3 de febrero',
        inscription: '$30.000',
        price: '$60.000 mensual',
        benefits: ['Incluye remera identificatoria'],
        schedules: [
          {
            days: 'Martes y Jueves',
            time: '16:30 a 18:00',
            ages: '6 a 9 años',
          },
          {
            days: 'Martes y Jueves',
            time: '17:00 a 18:30',
            ages: '9 a 12 inicial',
          },
          {
            days: 'Martes y Jueves',
            time: '18:00 a 19:30',
            ages: '10 a 12 avanzados + 13 a 15',
          },
        ],
      },
      {
        code: 'taekwondo',
        menuOption: '6',
        name: 'Escuela de Taekwondo',
        category: 'artes marciales',
        description: 'Entrenamiento de Taekwondo y Hapkido.',
        instructor: 'Ariel Calderón',
        start: '3 de febrero',
        price: '$50.000 mensual',
        inscription: 'Sin inscripción',
        contactPhone: '2616759911',
        schedules: [
          {
            days: 'Martes y Jueves',
            time: '19:00',
            type: 'Infantil',
          },
          {
            days: 'Martes y Jueves',
            time: '20:00 a 21:00',
            type: 'Adultos',
          },
        ],
      },
      {
        code: 'judo',
        menuOption: '7',
        name: 'Judo – Academia AJA',
        category: 'artes marciales',
        description:
          'Academia de judo con enfoque en respeto, disciplina y compañerismo.',
        instructor: 'Nicolás Alvarez',
        contactPhone: '2617110170',
        prices: ['4 clases mensuales: $25.000', '8 clases mensuales: $30.000'],
        schedules: [
          {
            days: 'Martes y Jueves',
            time: '18:00 a 19:00',
            type: 'Judo Kids',
          },
          {
            days: 'Martes y Jueves',
            time: '20:00 a 21:30',
            type: 'Adultos',
          },
        ],
      },
    ];

  const results: { code: string; status: string }[] = [];

    for (const activity of activities) {
      const existing = await this.activityModel.findOne({ code: activity.code });

      if (existing) {
        results.push({
          code: activity?.code,
          status: 'already_exists',
        });
        continue;
      }

      const created = await this.activityModel.create(activity);

     results.push({
      code: created.code,
      status: 'created',
    });
  }

  return {
    message: 'Seed de actividades finalizado',
    results,
  };
}
  async getAll() {
    return this.activityModel.find().sort({ menuOption: 1 }).lean();
  }

  async getByMenuOption(menuOption: string) {
    return this.activityModel.findOne({ menuOption }).lean();
  }

  async getByCode(code: string) {
    return this.activityModel.findOne({ code }).lean();
  }
}