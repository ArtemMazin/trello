import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Пользователь с id ${id} не найден`, HttpStatus.NOT_FOUND);
  }
}
