import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { ApiCommonResponses, ApiSuccessResponse } from 'src/decorators';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CommentAuthorGuard } from 'src/guards/comment-author.guard';
import { UserResponseDto } from 'src/users/dto';
import { CreateCommentDto, CommentResponseDto, UpdateCommentDto } from './dto';

@ApiTags('Комментарии')
@Controller('users/:userId/columns/:columnId/cards/:cardId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание нового комментария' })
  @ApiBody({ type: CreateCommentDto })
  @ApiCommonResponses()
  async createComment(
    @Req() req: Request & { user: UserResponseDto },
    @Param('cardId') cardId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.createComment(
      req.user._id,
      createCommentDto,
      cardId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех комментариев карточки' })
  @ApiCommonResponses()
  async getCommentsByCardId(
    @Param('cardId') cardId: string,
  ): Promise<CommentResponseDto[]> {
    return this.commentsService.getCommentsByCardId(cardId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение комментария по ID' })
  @ApiParam({ name: 'id', description: 'ID комментария' })
  @ApiCommonResponses()
  async getComment(@Param('id') id: string): Promise<CommentResponseDto> {
    return this.commentsService.getComment(id);
  }

  @Patch(':id')
  @UseGuards(CommentAuthorGuard)
  @ApiOperation({ summary: 'Обновление комментария' })
  @ApiParam({ name: 'id', description: 'ID комментария' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiCommonResponses()
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.updateComment(id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(CommentAuthorGuard)
  @ApiOperation({ summary: 'Удаление комментария' })
  @ApiParam({ name: 'id', description: 'ID комментария' })
  @ApiSuccessResponse()
  @ApiCommonResponses()
  async deleteComment(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.commentsService.deleteComment(id);
  }
}
