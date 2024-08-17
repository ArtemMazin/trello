import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as argon2 from 'argon2';
import { User } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from 'src/users/dto';
import { LoginDto } from './dto/login.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.checkConfig();
  }

  // Проверка наличия необходимых конфигурационных параметров
  private checkConfig() {
    const requiredParams = ['TOKEN_NAME', 'TOKEN_MAX_AGE', 'JWT_SECRET'];
    for (const param of requiredParams) {
      if (!this.configService.get(param)) {
        throw new Error(
          `Отсутствует обязательный параметр конфигурации: ${param}`,
        );
      }
    }
  }

  async register(
    userData: RegisterDto,
    res: Response,
  ): Promise<UserResponseDto> {
    try {
      const hashedPassword = await argon2.hash(userData.password);

      const newUser = await this.usersService.create({
        ...userData,
        password: hashedPassword,
      });

      const accessToken = this.createAccessToken(newUser);

      this.setTokenCookie(res, accessToken);

      const userResponse = plainToClass(UserResponseDto, newUser.toObject(), {
        excludeExtraneousValues: true,
      });

      this.logger.log(`Пользователь зарегистрирован: ${newUser.email}`);
      return userResponse;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }
      this.logger.error(
        `Ошибка при регистрации: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async validateUser(userData: LoginDto): Promise<UserResponseDto | null> {
    try {
      const user = await this.usersService.findByEmail(userData.email);

      if (!user) {
        return null;
      }

      const isPasswordValid = await argon2.verify(
        user.password,
        userData.password,
      );
      if (!isPasswordValid) {
        return null;
      }
      const userResponse = plainToClass(UserResponseDto, user.toObject(), {
        excludeExtraneousValues: true,
      });
      return userResponse;
    } catch (error) {
      this.logger.error(
        `Ошибка при валидации пользователя: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async login(res: Response, user: UserResponseDto): Promise<UserResponseDto> {
    try {
      const accessToken = this.createAccessToken(user);
      this.setTokenCookie(res, accessToken);

      this.logger.log(`Пользователь вошел в систему: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Ошибка при входе в систему: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async logout(res: Response): Promise<{ success: boolean }> {
    try {
      res.clearCookie(this.configService.get('TOKEN_NAME'), {
        httpOnly: true,
        sameSite: 'strict',
      });
      this.logger.log('Пользователь вышел из системы');
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Ошибка при выходе из системы: ${error.message}`,
        error.stack,
      );
      return { success: false };
    }
  }

  private createAccessToken(user: Pick<User, '_id' | 'email'>): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user._id,
    });
  }

  private setTokenCookie(res: Response, token: string): void {
    res.cookie(this.configService.get('TOKEN_NAME'), token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: this.configService.get('TOKEN_MAX_AGE'),
    });
  }
}
