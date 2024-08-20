import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Length,
} from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    description: 'Заголовок карточки',
    example: 'Написать отчет',
  })
  @IsNotEmpty({ message: 'Заголовок карточки не может быть пустым' })
  @IsString({ message: 'Заголовок карточки должен быть строкой' })
  @Length(1, 100, {
    message: 'Заголовок карточки должен быть от 1 до 100 символов',
  })
  readonly title: string;

  @ApiProperty({
    description: 'Описание карточки',
    example: 'Подготовить ежемесячный отчет о продажах',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Описание карточки должно быть строкой' })
  @Length(0, 1000, {
    message: 'Описание карточки должно быть не более 1000 символов',
  })
  readonly description?: string;

  @ApiProperty({
    description: 'Порядковый номер карточки',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Порядковый номер должен быть числом' })
  readonly order?: number;
}
