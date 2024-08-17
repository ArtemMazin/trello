import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateUserDto, UserResponseDto } from './dto';
import {
  ApiCommonResponses,
  ApiSuccessResponse,
  ApiUserResponses,
} from 'src/decorators';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiUserResponses()
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Обновление информации о пользователе' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Данные для обновления пользователя',
  })
  @ApiUserResponses()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiSuccessResponse()
  @ApiCommonResponses()
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  async deleteUser(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.usersService.deleteUser(id);
  }
}
