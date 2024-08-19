import { NotFoundException } from '@nestjs/common';

export class CommentNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Комментарий с ID "${id}" не найден`);
  }
}
