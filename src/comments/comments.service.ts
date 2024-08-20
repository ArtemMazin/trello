import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from 'src/schemas/comment.schema';
import { plainToClass } from 'class-transformer';
import { CommentNotFoundException } from './exeptions';
import { CommentResponseDto, CreateCommentDto, UpdateCommentDto } from './dto';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async createComment(
    authorId: string,
    createCommentDto: CreateCommentDto,
    cardId: string,
  ): Promise<CommentResponseDto> {
    try {
      this.validateObjectId(authorId);
      this.validateObjectId(cardId);
      const newComment = new this.commentModel({
        ...createCommentDto,
        authorId,
        cardId,
      });
      const savedComment = await newComment.save();
      this.logger.log(`Создан новый комментарий для карточки: ${cardId}`);

      return this.toCommentResponse(savedComment);
    } catch (error) {
      this.logger.error(
        `Ошибка при создании комментария: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Ошибка при создании комментария');
    }
  }

  async getComment(id: string): Promise<CommentResponseDto> {
    this.validateObjectId(id);

    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new CommentNotFoundException(id);
    }

    this.logger.log(`Комментарий с id ${id} получен`);
    return this.toCommentResponse(comment);
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    this.validateObjectId(id);

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();
    if (!updatedComment) {
      throw new CommentNotFoundException(id);
    }
    this.logger.log(`Комментарий с id ${id} обновлен`);
    return this.toCommentResponse(updatedComment);
  }

  async deleteComment(id: string): Promise<{ success: boolean }> {
    this.validateObjectId(id);

    const result = await this.commentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new CommentNotFoundException(id);
    }
    this.logger.log(`Комментарий с id ${id} удален`);

    return { success: true };
  }

  async deleteCommentsByCardId(cardId: string | string[]): Promise<void> {
    if (Array.isArray(cardId)) {
      cardId.forEach((id) => this.validateObjectId(id));
      await this.commentModel.deleteMany({ cardId: { $in: cardId } }).exec();
      this.logger.log(
        `Удалены все комментарии для карточек с id: ${cardId.join(', ')}`,
      );
    } else {
      this.validateObjectId(cardId);
      await this.commentModel.deleteMany({ cardId }).exec();
      this.logger.log(`Удалены все комментарии для карточки с id ${cardId}`);
    }
  }

  async getCommentsByCardId(cardId: string): Promise<CommentResponseDto[]> {
    this.validateObjectId(cardId);

    const comments = await this.commentModel.find({ cardId }).exec();
    this.logger.log(`Получены комментарии для карточки: ${cardId}`);

    return comments.map((comment) => this.toCommentResponse(comment));
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Некорректный формат ID');
    }
  }

  private toCommentResponse(comment: Comment): CommentResponseDto {
    return plainToClass(CommentResponseDto, comment.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
