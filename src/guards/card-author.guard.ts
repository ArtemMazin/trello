import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class CardAuthorGuard implements CanActivate {
  constructor(private cardsService: CardsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user._id;
    const cardId = request.params.id;

    const card = await this.cardsService.getCard(cardId);

    if (card.authorId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'У вас нет прав для выполнения этой операции',
      );
    }

    return true;
  }
}
