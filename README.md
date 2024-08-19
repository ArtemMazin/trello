# Trello Clone API

Это RESTful API, разработанное на NestJS, которое имитирует основной функционал Trello. API предоставляет возможности для управления досками, колонками, карточками и комментариями с системой аутентификации пользователей.

## Особенности

- Аутентификация пользователей с использованием JWT
- CRUD операции для пользователей, колонок, карточек и комментариев
- Валидация входных данных
- Авторизация на уровне ресурсов
- Документация API с использованием Swagger

## Технологии

- NestJS
- MongoDB
- Passport.js для аутентификации
- JWT для авторизации
- Class-validator для валидации данных
- Swagger для документации API

## Установка

1. Клонируйте репозиторий:
   `git clone git@github.com:ArtemMazin/trello.git`

2. Перейдите в директорию проекта:
   `cd trello`

3. Установите зависимости:
   `npm install`

4. Создайте файл `.env` в корневой директории проекта и добавьте необходимые переменные окружения:

   - `PORT`: Порт, на котором будет запущен сервер (по умолчанию 5000)
   - `MONGO_URI`: URI для подключения к MongoDB
   - `TOKEN_NAME`: Имя токена, используемого для аутентификации
   - `JWT_SECRET`: Секретный ключ для подписи JWT токенов
   - `TOKEN_MAX_AGE`: Максимальное время жизни токена в миллисекундах (по умолчанию 1 час)

5. Запустите сервер:
   `npm run start`

## API Endpoints

### Аутентификация:

- `POST /auth/register` - Регистрация нового пользователя
- `POST /auth/login` - Вход пользователя в систему
- `POST /auth/logout` - Выход пользователя из системы

### Пользователи:

- `GET /users/:id` - Получение информации о пользователе по ID
- `PATCH /users/:id` - Обновление информации пользователя
- `DELETE /users/:id` - Удаление пользователя

### Колонки:

- `GET /users/:userId/columns` - Получение всех колонок пользователя
- `POST /users/:userId/columns` - Создание новой колонки
- `GET /users/:userId/columns/:id` - Получение информации о конкретной колонке
- `PATCH /users/:userId/columns/:id` - Обновление информации колонки
- `DELETE /users/:userId/columns/:id` - Удаление колонки

### Карточки:

- `GET /users/:userId/columns/:columnId/cards` - Получение всех карточек в колонке
- `POST /users/:userId/columns/:columnId/cards` - Создание новой карточки
- `GET /users/:userId/columns/:columnId/cards/:id` - Получение информации о конкретной карточке
- `PATCH /users/:userId/columns/:columnId/cards/:id` - Обновление информации карточки
- `DELETE /users/:userId/columns/:columnId/cards/:id` - Удаление карточки
- `PATCH /users/:userId/columns/:columnId/cards/:id/move` - Перемещение карточки между колонками

### Комментарии:

- `GET /users/:userId/columns/:columnId/cards/:cardId/comments` - Получение всех комментариев к карточке
- `POST /users/:userId/columns/:columnId/cards/:cardId/comments` - Создание нового комментария
- `GET /users/:userId/columns/:columnId/cards/:cardId/comments/:id` - Получение конкретного комментария
- `PATCH /users/:userId/columns/:columnId/cards/:cardId/comments/:id` - Обновление комментария
- `DELETE /users/:userId/columns/:columnId/cards/:cardId/comments/:id` - Удаление комментария

## Документация API

После запуска приложения, документация Swagger доступна по адресу:
[http://localhost:3000/api](http://localhost:3000/api)

## Безопасность

- Все эндпоинты, кроме регистрации и входа, требуют JWT токен для аутентификации.
- Реализована проверка владельца ресурса для операций изменения и удаления.

## Разработка

- Для запуска приложения в режиме разработки:
  `npm run start:dev`

## Структура проекта

```
src/
├── auth/
├── users/
├── columns/
├── cards/
├── comments/
├── guards/
├── decorators/
├── schemas/
├── app.module.ts
└── main.ts
```
