# 🐳 Docker & CI/CD Setup

Профессиональная настройка Docker и CI/CD для монорепы с Turbo.

## 📋 Требования

- Docker & Docker Compose
- Node.js 18+
- npm или yarn

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Установить зависимости
make install

# Запустить локальную среду с Docker
make docker-dev

# Или пошагово:
make docker-build
make docker-up
```

### Продакшен

```bash
# Собрать продакшен образы
make docker-prod-build

# Запустить продакшен
make docker-prod-up
```

## 📁 Структура файлов

```
├── apps/
│   ├── api/Dockerfile          # API контейнер
│   └── web/Dockerfile          # Web контейнер
├── docker-compose.yml          # Локальная разработка
├── docker-compose.prod.yml     # Продакшен
├── nginx/nginx.conf            # Nginx конфигурация
├── scripts/
│   ├── build.sh               # Скрипт сборки
│   ├── deploy.sh              # Скрипт деплоя
│   └── docker-dev.sh          # Локальный запуск
├── .github/workflows/
│   └── deploy.yml             # GitHub Actions
└── Makefile                   # Команды управления
```

## 🔧 Команды Make

```bash
# Основные команды
make help                    # Показать справку
make install                 # Установить зависимости
make build                   # Собрать проект
make test                    # Запустить тесты
make lint                    # Запустить линтер
make type-check              # Проверить типы
make check                   # Все проверки

# Docker команды
make docker-build            # Собрать образы
make docker-up               # Запустить контейнеры
make docker-down             # Остановить контейнеры
make docker-logs             # Показать логи
make docker-dev              # Локальная разработка
make docker-clean            # Очистить Docker

# Продакшен команды
make docker-prod-build       # Собрать продакшен
make docker-prod-up          # Запустить продакшен
make docker-prod-down        # Остановить продакшен
make deploy                  # Деплой на сервер
```

## 🐳 Docker контейнеры

### API (NestJS)
- **Порт**: 3001
- **База данных**: PostgreSQL
- **Переменные окружения**: JWT, YooKassa, Database URL

### Web (Next.js)
- **Порт**: 3000
- **Статические файлы**: Nginx
- **Переменные окружения**: API URL

### Nginx (Reverse Proxy)
- **Порт**: 80/443
- **SSL**: Поддерживается
- **Gzip**: Включено
- **Кэширование**: Статические файлы

### PostgreSQL
- **Порт**: 5432
- **Данные**: Docker volume
- **Миграции**: Автоматические

## 🔄 CI/CD Pipeline

### GitHub Actions

1. **Test Job**
   - Установка зависимостей
   - Проверка типов
   - Линтинг
   - Тесты

2. **Build Job**
   - Сборка Docker образов
   - Push в GitHub Container Registry
   - Кэширование слоев

3. **Deploy Job**
   - SSH подключение к серверу
   - Остановка старых контейнеров
   - Очистка Docker
   - Запуск новых контейнеров
   - Health check

### Переменные окружения

Добавьте в GitHub Secrets:

```bash
HOST=your-server-ip
USERNAME=your-username
SSH_KEY=your-private-key
PORT=22
```

## 🚀 Деплой на сервер

### Подготовка сервера

```bash
# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установить Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Создать директорию проекта
sudo mkdir -p /opt/shop
sudo chown $USER:$USER /opt/shop
```

### Настройка переменных окружения

Создайте `.env` файл:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/db
SHADOW_DATABASE_URL=postgresql://user:password@host:5432/db_shadow

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# YooKassa
YOO_KASSA_SHOP_ID=your-shop-id
YOO_KASSA_SECRET_KEY=your-secret-key
YOO_KASSA_API_URL=https://api.yookassa.ru/v3

# Frontend
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### Автоматический деплой

При каждом push в `main` ветку:
1. GitHub Actions собирает образы
2. Push в Container Registry
3. Автоматический деплой на сервер
4. Health check

## 🧹 Оптимизация места

### Автоматическая очистка

- Удаление старых образов
- Очистка неиспользуемых volumes
- Очистка Docker кэша

### Команды очистки

```bash
# Очистить все
make docker-clean-all

# Очистить только неиспользуемое
make docker-clean

# Очистить вручную
docker system prune -a -f
docker volume prune -f
```

## 🔍 Мониторинг

### Health Checks

- API: `http://localhost/health`
- Web: `http://localhost/`
- Database: Автоматическая проверка

### Логи

```bash
# Все логи
make docker-logs

# Конкретный сервис
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f nginx
```

## 🛠️ Troubleshooting

### Проблемы с памятью

```bash
# Очистить Docker
make docker-clean-all

# Проверить использование диска
df -h
docker system df
```

### Проблемы с сетью

```bash
# Перезапустить сеть
docker network prune -f
docker-compose down
docker-compose up -d
```

### Проблемы с базой данных

```bash
# Проверить статус
docker-compose ps postgres

# Подключиться к базе
docker-compose exec postgres psql -U shop_user -d shop_db
```

## 📊 Производительность

### Оптимизации

- Многоэтапная сборка Docker
- Кэширование npm зависимостей
- Gzip сжатие в Nginx
- Кэширование статических файлов
- Health checks для всех сервисов

### Мониторинг ресурсов

```bash
# Использование ресурсов
docker stats

# Логи производительности
docker-compose logs nginx | grep "performance"
```
