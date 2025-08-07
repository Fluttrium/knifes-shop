# Многоэтапная сборка для оптимизации размера
FROM node:18-alpine AS base

# Устанавливаем зависимости для сборки
RUN apk add --no-cache libc6-compat

# Создаем рабочую директорию
WORKDIR /app

# Копируем файлы для установки зависимостей
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/api-client/package*.json ./packages/api-client/
COPY packages/eslint-config/package*.json ./packages/eslint-config/
COPY packages/typescript-config/package*.json ./packages/typescript-config/

# Устанавливаем зависимости
RUN npm ci --only=production --ignore-scripts

# Этап сборки
FROM base AS builder

# Устанавливаем все зависимости включая devDependencies
RUN npm ci --ignore-scripts

# Копируем исходный код
COPY . .

# Собираем все пакеты с помощью Turbo
RUN npx turbo run build --filter=api...

# Этап production
FROM node:18-alpine AS runner

# Устанавливаем необходимые пакеты
RUN apk add --no-cache dumb-init

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package*.json ./apps/api/
COPY --from=builder --chown=nestjs:nodejs /app/packages/api-client/package*.json ./packages/api-client/

# Копируем собранные файлы
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/api-client/dist ./packages/api-client/dist

# Копируем Prisma схему и миграции
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./apps/api/prisma

# Переключаемся на пользователя nestjs
USER nestjs

# Открываем порт
EXPOSE 3001

# Используем dumb-init для правильной обработки сигналов
ENTRYPOINT ["dumb-init", "--"]

# Запускаем приложение
CMD ["node", "apps/api/dist/main.js"]
