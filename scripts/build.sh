#!/bin/bash

# Скрипт для проверки и сборки проекта с Turbo
# Использование: ./scripts/build.sh

set -e

echo "🔍 Checking project structure..."

# Проверяем наличие необходимых файлов
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

if [ ! -f "turbo.json" ]; then
    echo "❌ turbo.json not found"
    exit 1
fi

if [ ! -d "apps" ]; then
    echo "❌ apps directory not found"
    exit 1
fi

if [ ! -d "packages" ]; then
    echo "❌ packages directory not found"
    exit 1
fi

echo "✅ Project structure is valid"

# Устанавливаем зависимости
echo "📦 Installing dependencies..."
npm ci

# Проверяем типы
echo "🔍 Running type checks..."
npx turbo run type-check

# Запускаем линтер
echo "🧹 Running linter..."
npx turbo run lint

# Запускаем тесты
echo "🧪 Running tests..."
npx turbo run test

# Собираем проект
echo "🏗️  Building project..."
npx turbo run build

echo "✅ Build completed successfully!"
