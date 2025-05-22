# Проект на T3 Stack (Next.js, Prisma, NextAuth, TypeScript)

## 🚀 Описание проекта

Это клиент-серверное веб-приложение для каталога аниме, где пользователи могут просматривать информацию об аниме, оставлять комментарии, отвечать на них и голосовать.

## 🛠 Технологии

- **T3 Stack** (Next.js, TypeScript, Tailwind, tRPC, Prisma, NextAuth)
- **Next.js 15** – React-фреймворк
- **TypeScript** – строгая типизация
- **Prisma** – ORM для работы с базой данных
- **NextAuth.js** – аутентификация
- **Tailwind CSS** – стилизация

## 📦 Установка

```bash

# 1. Клонировать репозиторий
git clone https://github.com/Uchlin/anime.git
cd anime

# 2. Установить зависимости
pnpm install

# 3. Инициализация БД
pnpm prisma migrate dev --name init

# 4. Заполнение БД начальными данными
pnpm db:seed

# 5. Запуск контейнеров
pnpm db:start

# 6. Запуск разработки
pnpm run dev
```
