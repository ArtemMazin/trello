import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class BaseAuthDto {
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'ivan@example.com',
  })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Некорректный формат email',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'Password123!',
  })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(8, 20, { message: 'Пароль должен быть от 8 до 20 символов' })
  @Matches(/[a-z]/, {
    message: 'Пароль должен содержать хотя бы одну строчную букву',
  })
  @Matches(/[A-Z]/, {
    message: 'Пароль должен содержать хотя бы одну заглавную букву',
  })
  @Matches(/\d/, { message: 'Пароль должен содержать хотя бы одну цифру' })
  @Matches(/[@$!%*?&]/, {
    message:
      'Пароль должен содержать хотя бы один специальный символ (@$!%*?&)',
  })
  readonly password: string;
}
