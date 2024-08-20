import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Column } from 'src/schemas/column.schema';
import { ColumnResponseDto, CreateColumnDto, UpdateColumnDto } from './dto';
import { plainToClass } from 'class-transformer';
import { ColumnNotFoundException } from './exeptions';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class ColumnsService {
  private readonly logger = new Logger(ColumnsService.name);

  constructor(
    @InjectModel(Column.name) private columnModel: Model<Column>,
    private cardsService: CardsService,
  ) {}

  async createColumn(
    authorId: string,
    createColumnDto: CreateColumnDto,
  ): Promise<ColumnResponseDto> {
    try {
      this.validateObjectId(authorId);
      const newColumn = new this.columnModel({
        ...createColumnDto,
        authorId,
      });
      const savedColumn = await newColumn.save();
      this.logger.log(`Создана новая колонка для пользователя: ${authorId}`);

      return this.toColumnResponse(savedColumn);
    } catch (error) {
      this.logger.error(
        `Ошибка при создании колонки: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Ошибка при создании колонки');
    }
  }

  async getColumn(id: string): Promise<ColumnResponseDto> {
    this.validateObjectId(id);

    const column = await this.columnModel.findById(id).exec();
    if (!column) {
      throw new ColumnNotFoundException(id);
    }

    this.logger.log(`Колонка с id ${id} получена`);
    return this.toColumnResponse(column);
  }

  async updateColumn(
    id: string,
    updateColumnDto: UpdateColumnDto,
  ): Promise<ColumnResponseDto> {
    this.validateObjectId(id);

    const updatedColumn = await this.columnModel
      .findByIdAndUpdate(id, updateColumnDto, { new: true })
      .exec();
    if (!updatedColumn) {
      throw new ColumnNotFoundException(id);
    }
    this.logger.log(`Колонка с id ${id} обновлена`);
    return this.toColumnResponse(updatedColumn);
  }

  async deleteColumn(id: string): Promise<{ success: boolean }> {
    this.validateObjectId(id);

    try {
      const column = await this.columnModel.findById(id).exec();
      if (!column) {
        throw new ColumnNotFoundException(id);
      }

      // Удаление всех карточек, связанных с этой колонкой
      await this.cardsService.deleteCardsByColumnId(id);

      // Удаление самой колонки
      await this.columnModel.findByIdAndDelete(id).exec();

      this.logger.log(`Колонка с id ${id} и все связанные карточки удалены`);

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Ошибка при удалении колонки: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getColumnsByUserId(authorId: string): Promise<ColumnResponseDto[]> {
    this.validateObjectId(authorId);

    const columns = await this.columnModel.find({ authorId }).exec();
    this.logger.log(`Получены колонки для пользователя: ${authorId}`);

    return columns.map((column) => this.toColumnResponse(column));
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Некорректный формат ID');
    }
  }

  private toColumnResponse(column: Column): ColumnResponseDto {
    return plainToClass(ColumnResponseDto, column.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
