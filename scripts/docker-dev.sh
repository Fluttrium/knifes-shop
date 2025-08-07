#!/bin/bash

# Скрипт для локального запуска с Docker
# Использование: ./scripts/docker-dev.sh

set -e

echo "🐳 Starting local development environment..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi

# Останавливаем существующие контейнеры
echo "⏹️  Stopping existing containers..."
docker-compose down

# Удаляем старые образы для экономии места
echo "🧹 Cleaning old images..."
docker image prune -f

# Собираем и запускаем контейнеры
echo "🏗️  Building and starting containers..."
docker-compose up --build -d

# Ждем запуска сервисов
echo "⏳ Waiting for services to start..."
sleep 30

# Проверяем статус
echo "📊 Checking service status..."
docker-compose ps

# Проверяем health endpoints
echo "🏥 Health checks..."
curl -f http://localhost/health || echo "❌ API health check failed"
curl -f http://localhost/ || echo "❌ Web health check failed"

echo "✅ Local development environment is ready!"
echo "🌐 Web: http://localhost"
echo "🔌 API: http://localhost/api"
echo "📊 Database: localhost:5432"
