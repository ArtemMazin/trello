import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as argon2 from 'argon2';
import { User } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from 'src/users/dto';
import { plainToClass } from 'class-transformer';
import {
  UserAlreadyExistsException,
  InvalidCredentialsException,
} from './exeptions';

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

  private checkConfig() {
    const requiredParams = ['TOKEN_NAME', 'TOKEN_MAX_AGE', 'JWT_SECRET'];
    for (const param of requiredParams) {
      if (!this.configService.get(param)) {
        throw new InternalServerErrorException(
          `Отсутствует обязательный параметр конфигурации: ${param}`,
        );
      }
    }
  }

  async register(
    userData: RegisterDto,
    res: Response,
  ): Promise<UserResponseDto> {
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(userData.email);
    }

    const hashedPassword = await argon2.hash(userData.password);

    const newUser = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });

    const accessToken = this.createAccessToken(newUser);
    this.setTokenCookie(res, accessToken);

    this.logger.log(`Пользователь зарегистрирован: ${newUser.email}`);

    return newUser;
  }

  async validateUser(userData: LoginDto): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(
      userData.email,
    );

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      userData.password,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return plainToClass(UserResponseDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async login(res: Response, user: UserResponseDto): Promise<UserResponseDto> {
    const accessToken = this.createAccessToken(user);
    this.setTokenCookie(res, accessToken);

    this.logger.log(`Пользователь вошел в систему: ${user.email}`);

    return user;
  }

  async logout(res: Response): Promise<{ success: boolean }> {
    res.clearCookie(this.configService.get<string>('TOKEN_NAME'), {
      httpOnly: true,
      sameSite: 'strict',
    });
    this.logger.log('Пользователь вышел из системы');

    return { success: true };
  }

  private createAccessToken(user: Pick<User, '_id' | 'email'>): string {
    if (!user._id || !user.email) {
      throw new BadRequestException('Недостаточно данных для создания токена');
    }
    return this.jwtService.sign({
      email: user.email,
      sub: user._id,
    });
  }

  private setTokenCookie(res: Response, token: string): void {
    const tokenName = this.configService.get<string>('TOKEN_NAME');
    const tokenMaxAge = this.configService.get<number>('TOKEN_MAX_AGE');

    res.cookie(tokenName, token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: tokenMaxAge,
    });
  }
}
