import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Card } from 'src/schemas/card.schema';
import { CardResponseDto, CreateCardDto, UpdateCardDto } from './dto';
import { plainToClass } from 'class-transformer';
import { CardNotFoundException } from './exeptions';

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);

  constructor(@InjectModel(Card.name) private cardModel: Model<Card>) {}

  async createCard(
    authorId: string,
    createCardDto: CreateCardDto,
    columnId: string,
  ): Promise<CardResponseDto> {
    try {
      this.validateObjectId(authorId);
      const newCard = new this.cardModel({
        ...createCardDto,
        authorId,
        columnId,
      });
      const savedCard = await newCard.save();
      this.logger.log(`Создана новая карточка для автора: ${authorId}`);

      return this.toCardResponse(savedCard);
    } catch (error) {
      this.logger.error(
        `Ошибка при создании карточки: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Ошибка при создании карточки');
    }
  }

  async getCard(id: string): Promise<CardResponseDto> {
    this.validateObjectId(id);

    const card = await this.cardModel.findById(id).exec();
    if (!card) {
      throw new CardNotFoundException(id);
    }

    this.logger.log(`Карточка с id ${id} получена`);
    return this.toCardResponse(card);
  }

  async updateCard(
    id: string,
    updateCardDto: UpdateCardDto,
  ): Promise<CardResponseDto> {
    this.validateObjectId(id);

    const updatedCard = await this.cardModel
      .findByIdAndUpdate(id, updateCardDto, { new: true })
      .exec();
    if (!updatedCard) {
      throw new CardNotFoundException(id);
    }
    this.logger.log(`Карточка с id ${id} обновлена`);
    return this.toCardResponse(updatedCard);
  }

  async deleteCard(id: string): Promise<{ success: boolean }> {
    this.validateObjectId(id);

    const result = await this.cardModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new CardNotFoundException(id);
    }
    this.logger.log(`Карточка с id ${id} удалена`);

    return { success: true };
  }

  async getCardsByColumnId(columnId: string): Promise<CardResponseDto[]> {
    this.validateObjectId(columnId);

    const cards = await this.cardModel.find({ columnId }).exec();
    this.logger.log(`Получены карточки для колонки: ${columnId}`);

    return cards.map((card) => this.toCardResponse(card));
  }

  async getCardsByAuthorId(authorId: string): Promise<CardResponseDto[]> {
    this.validateObjectId(authorId);

    const cards = await this.cardModel.find({ authorId }).exec();
    this.logger.log(`Получены карточки для автора: ${authorId}`);

    return cards.map((card) => this.toCardResponse(card));
  }

  async changeCardOrder(
    cardId: string,
    newOrder: number,
  ): Promise<CardResponseDto> {
    this.validateObjectId(cardId);

    const card = await this.cardModel.findById(cardId);
    if (!card) {
      throw new CardNotFoundException(cardId);
    }

    card.order = newOrder;
    const updatedCard = await card.save();
    this.logger.log(`Изменен порядок карточки ${cardId} на ${newOrder}`);

    return this.toCardResponse(updatedCard);
  }

  async moveCard(
    cardId: string,
    newColumnId: string,
  ): Promise<CardResponseDto> {
    this.validateObjectId(cardId);
    this.validateObjectId(newColumnId);

    const card = await this.cardModel.findById(cardId);
    if (!card) {
      throw new CardNotFoundException(cardId);
    }

    card.columnId = newColumnId;
    const updatedCard = await card.save();
    this.logger.log(`Карточка ${cardId} перемещена в колонку ${newColumnId}`);

    return this.toCardResponse(updatedCard);
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Некорректный формат ID');
    }
  }

  private toCardResponse(card: Card): CardResponseDto {
    return plainToClass(CardResponseDto, card.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
