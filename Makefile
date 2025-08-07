.PHONY: help install build test lint type-check clean docker-build docker-up docker-down docker-logs deploy

# Переменные
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_PROD = docker-compose -f docker-compose.prod.yml

help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Установить зависимости
	npm ci

build: ## Собрать проект с Turbo
	npx turbo run build

test: ## Запустить тесты
	npx turbo run test

lint: ## Запустить линтер
	npx turbo run lint

type-check: ## Проверить типы
	npx turbo run type-check

check: ## Запустить все проверки
	npx turbo run type-check
	npx turbo run lint
	npx turbo run test

clean: ## Очистить кэш и build файлы
	npx turbo run clean
	rm -rf node_modules
	rm -rf apps/*/dist
	rm -rf apps/*/.next
	rm -rf packages/*/dist

docker-build: ## Собрать Docker образы
	$(DOCKER_COMPOSE) build

docker-up: ## Запустить Docker контейнеры
	$(DOCKER_COMPOSE) up -d

docker-down: ## Остановить Docker контейнеры
	$(DOCKER_COMPOSE) down

docker-logs: ## Показать логи Docker контейнеров
	$(DOCKER_COMPOSE) logs -f

docker-dev: ## Запустить локальную среду разработки
	./scripts/docker-dev.sh

docker-prod-build: ## Собрать продакшен образы
	$(DOCKER_COMPOSE_PROD) build

docker-prod-up: ## Запустить продакшен контейнеры
	$(DOCKER_COMPOSE_PROD) up -d

docker-prod-down: ## Остановить продакшен контейнеры
	$(DOCKER_COMPOSE_PROD) down

docker-prod-logs: ## Показать логи продакшен контейнеров
	$(DOCKER_COMPOSE_PROD) logs -f

deploy: ## Деплой на сервер
	./scripts/deploy.sh

setup: ## Настройка проекта
	@echo "🔧 Setting up project..."
	npm ci
	npx turbo run build
	@echo "✅ Setup completed!"

dev: ## Запустить в режиме разработки
	@echo "🚀 Starting development mode..."
	npx turbo run dev

format: ## Форматировать код
	npx turbo run format

# Специальные команды для монорепы
api-dev: ## Запустить только API в режиме разработки
	npx turbo run dev --filter=api

web-dev: ## Запустить только Web в режиме разработки
	npx turbo run dev --filter=web

api-build: ## Собрать только API
	npx turbo run build --filter=api

web-build: ## Собрать только Web
	npx turbo run build --filter=web

# Команды для очистки Docker
docker-clean: ## Очистить Docker кэш и образы
	docker system prune -f
	docker image prune -f
	docker volume prune -f

docker-clean-all: ## Полная очистка Docker
	docker system prune -a -f
	docker volume prune -f
	docker network prune -f
