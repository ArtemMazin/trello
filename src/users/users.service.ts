import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: RegisterDto): Promise<User> {
    try {
      const newUser = new this.userModel(user);
      const savedUser = await newUser.save();
      this.logger.log(`Создан новый пользователь: ${savedUser.email}`);
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Ошибка при создании пользователя: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        this.logger.log(`Пользователь с email ${email} не найден`);
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Ошибка при поиске пользователя по email: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
