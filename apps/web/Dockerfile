# Многоэтапная сборка для оптимизации размера
FROM node:18-alpine AS base

# Устанавливаем зависимости для сборки
RUN apk add --no-cache libc6-compat

# Создаем рабочую директорию
WORKDIR /app

# Копируем файлы для установки зависимостей
COPY package*.json ./
COPY turbo.json ./
COPY apps/web/package*.json ./apps/web/
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
RUN npx turbo run build --filter=web...

# Этап production
FROM node:18-alpine AS runner

# Устанавливаем необходимые пакеты
RUN apk add --no-cache dumb-init

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package*.json ./apps/web/
COPY --from=builder --chown=nextjs:nodejs /app/packages/api-client/package*.json ./packages/api-client/

# Копируем собранные файлы
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/packages/api-client/dist ./packages/api-client/dist

# Переключаемся на пользователя nextjs
USER nextjs

# Открываем порт
EXPOSE 3000

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Используем dumb-init для правильной обработки сигналов
ENTRYPOINT ["dumb-init", "--"]

# Запускаем приложение
CMD ["npm", "run", "start", "--workspace=apps/web"]
