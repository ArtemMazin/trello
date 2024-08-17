import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import { RegisterDto } from 'src/auth/dto';
import { User } from 'src/schemas/user.schema';
import { UserNotFoundException } from './exeptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: RegisterDto): Promise<UserResponseDto> {
    try {
      const newUser = new this.userModel(user);
      const savedUser = await newUser.save();
      this.logger.log(`Создан новый пользователь: ${savedUser.email}`);

      return this.toUserResponse(savedUser);
    } catch (error) {
      this.logger.error(
        `Ошибка при создании пользователя: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Ошибка при создании пользователя');
    }
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      this.logger.log(`Пользователь с email ${email} не найден`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      this.logger.log(`Пользователь с email ${email} не найден`);
      return null;
    }
    return this.toUserResponse(user);
  }

  async getUser(id: string): Promise<UserResponseDto> {
    this.validateObjectId(id);

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException(id);
    }

    this.logger.log(`Пользователь с id ${id} получен`);
    return this.toUserResponse(user);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    this.validateObjectId(id);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new UserNotFoundException(id);
    }
    this.logger.log(`Пользователь с id ${id} обновлен`);
    return this.toUserResponse(updatedUser);
  }

  async deleteUser(id: string): Promise<{ success: boolean }> {
    this.validateObjectId(id);

    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new UserNotFoundException(id);
    }
    this.logger.log(`Пользователь с id ${id} удален`);

    return { success: true };
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Некорректный формат ID');
    }
  }

  private toUserResponse(user: User): UserResponseDto {
    return plainToClass(UserResponseDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
