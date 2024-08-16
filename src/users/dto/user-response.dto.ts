import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDate,
  IsMongoId,
} from 'class-validator';

export class UserResponseDto {
  @ApiProperty({ example: '5f9d5a7b9d3e2a1b3c5d7e9f' })
  @IsMongoId({ message: 'Некорректный формат ID' })
  _id: string;

  @ApiProperty({ example: 'Иван Иванов' })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  name: string;

  @ApiProperty({ example: 'ivan@example.com' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate({ message: 'Некорректный формат даты создания' })
  createdAt: Date;

  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate({ message: 'Некорректный формат даты обновления' })
  updatedAt: Date;
}
