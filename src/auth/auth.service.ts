import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto, RegisterResponseDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as argon2 from 'argon2';
import { User } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from 'src/users/dto';

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

      const userWithoutPassword = this.excludePassword(newUser);

      return { newUser: userWithoutPassword, accessToken };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }
      throw error;
    }
  }

  private createAccessToken(user: User): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user._id.toString(),
    });
  }

  private setTokenCookie(res: Response, token: string): void {
    res.cookie(this.configService.get('TOKEN_NAME'), token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: this.configService.get('TOKEN_MAX_AGE'),
    });
  }

  private excludePassword(user: User): UserResponseDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
}
