import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from 'src/Domain/squema/contact.schema';


@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  normalizePhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return phoneNumber;

    // Para Argentina: 549xxxxxxxxx -> 54xxxxxxxxxx
    if (phoneNumber.startsWith('549') && phoneNumber.length === 13) {
      return '54' + phoneNumber.slice(3);
    }

    return phoneNumber.trim();
  }

  async findByPhoneNumber(phoneNumber: string): Promise<ContactDocument | null> {
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber);

    return this.contactModel.findOne({ phoneNumber: normalizedPhone });
  }

  async create(phoneNumber: string, name?: string): Promise<ContactDocument> {
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber);

    return this.contactModel.create({
      phoneNumber: normalizedPhone,
      name,
      channel: 'whatsapp',
      status: 'active',
      lastInteractionAt: new Date(),
    });
  }

  async findOrCreateByPhone(
    phoneNumber: string,
    name?: string,
  ): Promise<ContactDocument> {
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber);

    let contact = await this.contactModel.findOne({
      phoneNumber: normalizedPhone,
    });

    if (contact) {
      if (name && !contact.name) {
        contact.name = name;
      }

      contact.lastInteractionAt = new Date();
      await contact.save();
      return contact;
    }

    return this.contactModel.create({
      phoneNumber: normalizedPhone,
      name,
      channel: 'whatsapp',
      status: 'active',
      lastInteractionAt: new Date(),
    });
  }

  async touch(contactId: string): Promise<void> {
    await this.contactModel.updateOne(
      { _id: contactId },
      {
        $set: {
          lastInteractionAt: new Date(),
        },
      },
    );
  }
}