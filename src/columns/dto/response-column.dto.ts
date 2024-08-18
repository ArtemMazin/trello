import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString, IsDate } from 'class-validator';

export class ColumnResponseDto {
  @Expose()
  @ApiProperty({ example: '5f9d5a7b9d3e2a1b3c5d7e9f' })
  @IsMongoId({ message: 'Некорректный формат ID колонки' })
  _id: string;

  @Expose()
  @ApiProperty({ example: '5f9d5a7b9d3e2a1b3c5d7e9f' })
  @IsMongoId({ message: 'Некорректный формат ID пользователя' })
  userId: string;

  @Expose()
  @ApiProperty({ example: 'To Do' })
  @IsNotEmpty({ message: 'Название колонки не может быть пустым' })
  @IsString({ message: 'Название колонки должно быть строкой' })
  title: string;

  @Expose()
  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate({ message: 'Некорректный формат даты создания' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate({ message: 'Некорректный формат даты обновления' })
  updatedAt: Date;
}
