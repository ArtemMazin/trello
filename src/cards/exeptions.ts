import { NotFoundException } from '@nestjs/common';

export class CardNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Карточка с id ${id} не найдена`);
  }
}
