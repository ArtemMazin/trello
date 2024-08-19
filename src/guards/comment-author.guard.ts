import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class CommentAuthorGuard implements CanActivate {
  constructor(private commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user._id;
    const commentId = request.params.id;

    const comment = await this.commentsService.getComment(commentId);

    if (comment.authorId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'У вас нет прав для выполнения этой операции',
      );
    }

    return true;
  }
}
