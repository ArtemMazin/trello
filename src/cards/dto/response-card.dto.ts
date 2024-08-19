import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
  IsNumber,
  Length,
} from 'class-validator';

export class CardResponseDto {
  @Expose()
  @ApiProperty({ example: '5f9d5a7b9d3e2a1b3c5d7e9f' })
  @IsMongoId({ message: 'Некорректный формат ID карточки' })
  _id: string;

  @Expose()
  @ApiProperty({ example: '5f9d5a7b9d3e2a1b3c5d7e9f' })
  @IsMongoId({ message: 'Некорректный формат ID колонки' })
  columnId: string;

  @Expose()
  @ApiProperty({ example: '5f9d5a7b9d3e2a1b3c5d7e9f' })
  @IsMongoId({ message: 'Некорректный формат ID автора' })
  authorId: string;

  @Expose()
  @ApiProperty({ example: 'Написать отчет' })
  @IsNotEmpty({ message: 'Заголовок карточки не может быть пустым' })
  @IsString({ message: 'Заголовок карточки должен быть строкой' })
  title: string;

  @Expose()
  @ApiProperty({ example: 'Подготовить ежемесячный отчет о продажах' })
  @IsOptional()
  @IsOptional()
  @IsString({ message: 'Описание карточки должно быть строкой' })
  @Length(0, 1000, {
    message: 'Описание карточки должно быть не более 1000 символов',
  })
  readonly description?: string;

  @Expose()
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'Порядковый номер должен быть числом' })
  order?: number;

  @Expose()
  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate({ message: 'Некорректный формат даты создания' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate({ message: 'Некорректный формат даты обновления' })
  updatedAt: Date;
}
