import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from 'src/schemas/card.schema';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    CommentsModule,
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
