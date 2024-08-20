import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { ApiOperation, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  ApiCreateCardResponse,
  ApiCommonResponses,
  ApiCardResponses,
  ApiSuccessResponse,
  ApiMoveCardResponse,
} from 'src/decorators';
import { CardAuthorGuard } from 'src/guards/card-author.guard';
import { UserResponseDto } from 'src/users/dto';
import {
  CreateCardDto,
  CardResponseDto,
  UpdateCardDto,
  MoveCardDto,
} from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Карточки')
@Controller('users/:userId/columns/:columnId/cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание новой карточки' })
  @ApiBody({ type: CreateCardDto })
  @ApiCreateCardResponse()
  @ApiCommonResponses()
  async createCard(
    @Req() req: Request & { user: UserResponseDto },
    @Param('columnId') columnId: string,
    @Body() createCardDto: CreateCardDto,
  ): Promise<CardResponseDto> {
    return this.cardsService.createCard(req.user._id, createCardDto, columnId);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех карточек колонки' })
  @ApiCardResponses()
  async getCardsByColumnId(
    @Param('columnId') columnId: string,
  ): Promise<CardResponseDto[]> {
    return this.cardsService.getCardsByColumnId(columnId);
  }

  @Get(':id')
  @UseGuards(CardAuthorGuard)
  @ApiOperation({ summary: 'Получение карточки по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки' })
  @ApiCardResponses()
  async getCard(@Param('id') id: string): Promise<CardResponseDto> {
    return this.cardsService.getCard(id);
  }

  @Patch(':id')
  @UseGuards(CardAuthorGuard)
  @ApiOperation({ summary: 'Обновление карточки' })
  @ApiParam({ name: 'id', description: 'ID карточки' })
  @ApiBody({ type: UpdateCardDto })
  @ApiCardResponses()
  async updateCard(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<CardResponseDto> {
    return this.cardsService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  @UseGuards(CardAuthorGuard)
  @ApiOperation({ summary: 'Удаление карточки и всех ее комментариев' })
  @ApiParam({ name: 'id', description: 'ID карточки' })
  @ApiSuccessResponse()
  @ApiCommonResponses()
  async deleteCard(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.cardsService.deleteCard(id);
  }

  @Patch(':id/order')
  @ApiOperation({ summary: 'Изменение порядка карточки' })
  @ApiParam({ name: 'id', description: 'ID карточки' })
  @ApiBody({
    schema: { type: 'object', properties: { order: { type: 'number' } } },
  })
  @ApiCardResponses()
  async changeCardOrder(
    @Param('id') id: string,
    @Body('order') newOrder: number,
  ): Promise<CardResponseDto> {
    return this.cardsService.changeCardOrder(id, newOrder);
  }

  @Patch(':id/move')
  @UseGuards(CardAuthorGuard)
  @ApiOperation({ summary: 'Перемещение карточки между колонками' })
  @ApiParam({ name: 'id', description: 'ID карточки' })
  @ApiBody({ type: MoveCardDto })
  @ApiMoveCardResponse()
  async moveCard(
    @Param('id') id: string,
    @Body() moveCardDto: MoveCardDto,
  ): Promise<CardResponseDto> {
    return this.cardsService.moveCard(id, moveCardDto.newColumnId);
  }
}
