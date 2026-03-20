import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({
  collection: 'contacts',
  timestamps: true,
})
export class Contact {
  @Prop({ required: true, unique: true, index: true })
  phoneNumber: string;

  @Prop()
  name?: string;

  @Prop({ default: 'whatsapp' })
  channel: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  lastInteractionAt?: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);