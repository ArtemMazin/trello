import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterDto, RegisterResponseDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  async register(
    @Body() userData: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(userData, res);
  }
}
