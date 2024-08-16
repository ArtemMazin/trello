import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto, RegisterResponseDto } from './dto';
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
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(
    userData: RegisterDto,
    res: Response,
  ): Promise<RegisterResponseDto> {
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

      return { user: userResponse, accessToken };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }
      throw error;
    }
  }

  async validateUser(userData: LoginDto): Promise<UserResponseDto> | null {
    const user = await this.usersService.findByEmail(userData.email);

    if (!user) {
      return null;
    }

    const passwordIsValid = await argon2.verify(
      user.password,
      userData.password,
    );
    if (!passwordIsValid) {
      return null;
    }
    const userResponse = plainToClass(UserResponseDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
    return userResponse;
  }

  async login(
    userData: LoginDto,
    res: Response,
    user: UserResponseDto,
  ): Promise<RegisterResponseDto> {
    const accessToken = this.createAccessToken(userData);
    this.setTokenCookie(res, accessToken);

    return {
      user,
      accessToken,
    };
  }

  private createAccessToken(user: Pick<User, 'password' | 'email'>): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user.password,
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
