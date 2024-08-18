import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({
    description: 'Название колонки',
    example: 'To Do',
  })
  @IsNotEmpty({ message: 'Название колонки не может быть пустым' })
  @IsString({ message: 'Название колонки должно быть строкой' })
  @Length(1, 100, {
    message: 'Название колонки должно быть от 1 до 100 символов',
  })
  readonly title: string;
}
