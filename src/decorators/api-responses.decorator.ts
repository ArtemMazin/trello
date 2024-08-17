import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto';

export const ApiCommonResponses = () => {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Некорректный запрос или данные' }),
    ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' }),
    ApiForbiddenResponse({ description: 'Доступ запрещен' }),
  );
};

export const ApiUserResponses = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Операция успешно выполнена',
      type: UserResponseDto,
    }),
    ApiNotFoundResponse({ description: 'Пользователь не найден' }),
    ApiCommonResponses(),
  );
};

export const ApiAuthResponses = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Операция успешно выполнена',
      type: UserResponseDto,
    }),
    ApiBadRequestResponse({ description: 'Некорректные данные' }),
    ApiUnauthorizedResponse({ description: 'Неверные учетные данные' }),
  );
};

export const ApiSuccessResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Операция успешно выполнена',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
        },
      },
    }),
  );
};

export const ApiRegisterResponses = () => {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'Пользователь успешно зарегистрирован',
      type: UserResponseDto,
    }),
    ApiBadRequestResponse({ description: 'Некорректные данные' }),
    ApiConflictResponse({
      description: 'Пользователь с таким email уже существует',
    }),
  );
};
