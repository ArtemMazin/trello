import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Column } from 'src/schemas/column.schema';
import { ColumnResponseDto, CreateColumnDto, UpdateColumnDto } from './dto';
import { plainToClass } from 'class-transformer';
import { ColumnNotFoundException } from './exeptions';

@Injectable()
export class ColumnsService {
  private readonly logger = new Logger(ColumnsService.name);

  constructor(@InjectModel(Column.name) private columnModel: Model<Column>) {}

  async createColumn(
    userId: string,
    createColumnDto: CreateColumnDto,
  ): Promise<ColumnResponseDto> {
    try {
      this.validateObjectId(userId);
      const newColumn = new this.columnModel({
        ...createColumnDto,
        userId,
      });
      const savedColumn = await newColumn.save();
      this.logger.log(`Создана новая колонка для пользователя: ${userId}`);

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

    const result = await this.columnModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new ColumnNotFoundException(id);
    }
    this.logger.log(`Колонка с id ${id} удалена`);

    return { success: true };
  }

  async getColumnsByUserId(userId: string): Promise<ColumnResponseDto[]> {
    this.validateObjectId(userId);

    const columns = await this.columnModel.find({ userId }).exec();
    this.logger.log(`Получены колонки для пользователя: ${userId}`);

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
