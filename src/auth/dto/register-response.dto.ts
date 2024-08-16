import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto';

export class RegisterResponseDto {
  @Expose()
  @ApiProperty()
  @ValidateNested()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsNotEmpty({ message: 'Access token не может быть пустым' })
  @IsString({ message: 'Access token должен быть строкой' })
  accessToken: string;
}
