import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ColumnsService } from 'src/columns/columns.service';

@Injectable()
export class ColumnAuthorGuard implements CanActivate {
  constructor(private columnsService: ColumnsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user._id;
    const columnId = request.params.id;

    const column = await this.columnsService.getColumn(columnId);
    if (column.userId.toString() !== userId) {
      throw new ForbiddenException(
        'У вас нет прав для выполнения этой операции',
      );
    }

    return true;
  }
}
