import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CommentResponseDto {
  @Expose()
  @ApiProperty({ example: '5f9d5a7b9d3e2a1b3c5d7e9f' })
  @IsMongoId({ message: 'Некорректный формат ID комментария' })
  _id: string;

  @Expose()
  @ApiProperty({ example: '5f9d5a7b9d3e2a1b3c5d7e9f' })
  @IsMongoId({ message: 'Некорректный формат ID карточки' })
  cardId: string;

  @Expose()
  @ApiProperty({ example: '5f9d5a7b9d3e2a1b3c5d7e9f' })
  @IsMongoId({ message: 'Некорректный формат ID автора' })
  authorId: string;

  @Expose()
  @ApiProperty({
    example: 'Это очень важная задача, нужно уделить ей особое внимание.',
  })
  @IsNotEmpty({ message: 'Текст комментария не может быть пустым' })
  @IsString({ message: 'Текст комментария должен быть строкой' })
  text: string;

  @Expose()
  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate({ message: 'Некорректный формат даты создания' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate({ message: 'Некорректный формат даты обновления' })
  updatedAt: Date;
}
