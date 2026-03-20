import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactsService } from 'src/Aplication/services/contact.service';
import { Contact, ContactSchema } from 'src/Domain/squema/contact.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema },
    ]),
  ],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactModule {}