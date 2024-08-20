import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Текст комментария',
    example: 'Это очень важная задача, нужно уделить ей особое внимание.',
  })
  @IsNotEmpty({ message: 'Текст комментария не может быть пустым' })
  @IsString({ message: 'Текст комментария должен быть строкой' })
  @Length(1, 1000, {
    message: 'Текст комментария должен быть от 1 до 1000 символов',
  })
  readonly text: string;
}
