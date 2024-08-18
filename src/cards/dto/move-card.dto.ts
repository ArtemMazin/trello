// src/cards/dto/move-card.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class MoveCardDto {
  @ApiProperty({
    description: 'ID новой колонки',
    example: '5f9d5a7b9d3e2a1b3c5d7e9f',
  })
  @IsMongoId({ message: 'Некорректный формат ID новой колонки' })
  newColumnId: string;

  @ApiProperty({
    description: 'Новый порядковый номер карточки (опционально)',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Порядковый номер должен быть числом' })
  newOrder?: number;
}
