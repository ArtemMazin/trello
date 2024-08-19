import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID карточки, к которой относится комментарий',
    example: '5f9d5a7b9d3e2a1b3c5d7e9f',
  })
  @IsNotEmpty({ message: 'ID карточки не может быть пустым' })
  @IsMongoId({ message: 'Некорректный формат ID карточки' })
  readonly cardId: string;

  @ApiProperty({
    description: 'ID автора комментария',
    example: '5f9d5a7b9d3e2a1b3c5d7e9f',
  })
  @IsNotEmpty({ message: 'ID автора не может быть пустым' })
  @IsMongoId({ message: 'Некорректный формат ID автора' })
  readonly authorId: string;

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
