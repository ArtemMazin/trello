import { Controller } from '@nestjs/common';
import { ColumnsService } from './columns.service';

@Controller('users/:userId/columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}
}
