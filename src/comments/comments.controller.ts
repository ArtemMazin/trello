import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('users/:userId/columns/:columnId/cards/:cardId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
}
