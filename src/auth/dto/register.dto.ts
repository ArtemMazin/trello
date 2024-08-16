import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { BaseAuthDto } from './base-auth.dto';

export class RegisterDto extends BaseAuthDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
  })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  @Length(2, 50, { message: 'Имя должно быть от 2 до 50 символов' })
  readonly name: string;
}
