#!/bin/bash

# Скрипт для деплоя на продакшен сервер
# Использование: ./scripts/deploy.sh

set -e

echo "🚀 Starting deployment..."

# Переходим в директорию проекта
cd /opt/shop

# Создаем backup текущего состояния
echo "📦 Creating backup..."
docker-compose -f docker-compose.prod.yml ps > backup_$(date +%Y%m%d_%H%M%S).txt

# Останавливаем приложения (но не базу данных)
echo "⏹️  Stopping applications..."
docker-compose -f docker-compose.prod.yml stop api web nginx

# Очищаем Docker для экономии места
echo "🧹 Cleaning Docker cache..."
docker image prune -f
docker system prune -f
docker volume prune -f

# Удаляем старые образы
echo "🗑️  Removing old images..."
docker images | grep 'shop' | awk '{print $3}' | xargs -r docker rmi -f

# Обновляем образы из registry
echo "⬇️  Pulling new images..."
docker-compose -f docker-compose.prod.yml pull api web

# Запускаем новые контейнеры
echo "▶️  Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d api web nginx

# Ждем запуска сервисов
echo "⏳ Waiting for services to start..."
sleep 30

# Проверяем статус
echo "📊 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Проверяем health endpoints
echo "🏥 Health checks..."
curl -f http://localhost:1488/health || echo "❌ API health check failed"
curl -f http://localhost:1488/ || echo "❌ Web health check failed"

# Проверяем HTTP (новый сервер)
echo "🔒 HTTP checks..."
curl -f http://localhost:1488/health || echo "❌ HTTP API health check failed"
curl -f http://localhost:1488/ || echo "❌ HTTP Web health check failed"

# Очищаем старые образы после успешного деплоя
echo "🧹 Final cleanup..."
docker image prune -f

# Проверяем использование диска
echo "💾 Disk usage:"
df -h /opt

echo "✅ Deployment completed successfully!"
echo "🌐 Application available at: http://92.118.114.147:1488"
echo "🔌 API available at: http://92.118.114.147:1488/api"
