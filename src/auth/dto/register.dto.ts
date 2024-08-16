import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
  })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  @Length(2, 50, { message: 'Имя должно быть от 2 до 50 символов' })
  readonly name: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'ivan@example.com',
  })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  readonly email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'сложный_пароль123',
  })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(8, 20, { message: 'Пароль должен быть от 8 до 20 символов' })
  readonly password: string;
}
