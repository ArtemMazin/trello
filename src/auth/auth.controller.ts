import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto, RegisterDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserResponseDto } from 'src/users/dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  async register(
    @Body() userData: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    return this.authService.register(userData, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно авторизован, возвращается токен доступа',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({
    status: 401,
    description: 'Неверный email или пароль',
  })
  async login(
    @Req() req: Request & { user: UserResponseDto },
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    return this.authService.login(res, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiBody({ schema: { properties: { success: { type: 'boolean' } } } })
  @ApiResponse({ status: 200, description: 'Пользователь успешно вышел' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    return this.authService.logout(res);
  }
}
