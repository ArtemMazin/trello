import { Body, Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  ApiCreateColumnResponse,
  ApiCommonResponses,
} from '../decorators/api-responses.decorator';
import { ColumnResponseDto, CreateColumnDto } from './dto';

@ApiTags('Колонки')
@Controller('users/:userId/columns')
@UseGuards(JwtAuthGuard)
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание новой колонки' })
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  @ApiBody({ type: CreateColumnDto })
  @ApiCreateColumnResponse()
  @ApiCommonResponses()
  async createColumn(
    @Param('userId') userId: string,
    @Body() createColumnDto: CreateColumnDto,
  ): Promise<ColumnResponseDto> {
    return this.columnsService.createColumn(userId, createColumnDto);
  }
}
