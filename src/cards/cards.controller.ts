import { Controller } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('users/:userId/columns/:columnId/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}
}
