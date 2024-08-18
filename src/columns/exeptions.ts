import { NotFoundException } from '@nestjs/common';

export class ColumnNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Колонка с id ${id} не найдена`);
  }
}
