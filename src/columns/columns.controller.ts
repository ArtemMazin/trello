import {
  Body,
  Controller,
  Post,
  Param,
  UseGuards,
  Patch,
  Get,
  Delete,
  Req,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  ApiCreateColumnResponse,
  ApiCommonResponses,
  ApiColumnResponses,
  ApiSuccessResponse,
} from '../decorators/api-responses.decorator';
import { ColumnResponseDto, CreateColumnDto, UpdateColumnDto } from './dto';
import { ColumnAuthorGuard } from 'src/guards/column-author.guard';
import { UserResponseDto } from 'src/users/dto';

@ApiTags('Колонки')
@Controller('users/:userId/columns')
@UseGuards(JwtAuthGuard)
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание новой колонки' })
  @ApiBody({ type: CreateColumnDto })
  @ApiCreateColumnResponse()
  @ApiCommonResponses()
  async createColumn(
    @Req() req: Request & { user: UserResponseDto },
    @Body() createColumnDto: CreateColumnDto,
  ): Promise<ColumnResponseDto> {
    return this.columnsService.createColumn(req.user._id, createColumnDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех колонок пользователя' })
  @ApiColumnResponses()
  async getColumnsByUserId(
    @Req() req: Request & { user: UserResponseDto },
  ): Promise<ColumnResponseDto[]> {
    return this.columnsService.getColumnsByUserId(req.user._id);
  }

  @Get(':id')
  @UseGuards(ColumnAuthorGuard)
  @ApiOperation({ summary: 'Получение колонки по ID' })
  @ApiParam({ name: 'id', description: 'ID колонки' })
  @ApiColumnResponses()
  async getColumn(@Param('id') id: string): Promise<ColumnResponseDto> {
    return this.columnsService.getColumn(id);
  }

  @Patch(':id')
  @UseGuards(ColumnAuthorGuard)
  @ApiOperation({ summary: 'Обновление колонки' })
  @ApiParam({ name: 'id', description: 'ID колонки' })
  @ApiBody({ type: UpdateColumnDto })
  @ApiColumnResponses()
  async updateColumn(
    @Param('id') id: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ): Promise<ColumnResponseDto> {
    return this.columnsService.updateColumn(id, updateColumnDto);
  }

  @Delete(':id')
  @UseGuards(ColumnAuthorGuard)
  @ApiOperation({ summary: 'Удаление колонки' })
  @ApiParam({ name: 'id', description: 'ID колонки' })
  @ApiSuccessResponse()
  @ApiCommonResponses()
  async deleteColumn(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.columnsService.deleteColumn(id);
  }
}
