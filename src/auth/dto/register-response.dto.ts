import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto';

export class RegisterResponseDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => UserResponseDto)
  newUser: UserResponseDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsNotEmpty({ message: 'Access token не может быть пустым' })
  @IsString({ message: 'Access token должен быть строкой' })
  accessToken: string;
}
