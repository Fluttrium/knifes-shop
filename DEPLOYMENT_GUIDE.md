# 🚀 Руководство по деплою

## 📋 Требования

- Сервер с Ubuntu/Debian
- Домен `knivesspb.fluttium.com` настроен на сервер
- Внешняя PostgreSQL база данных

## 🔑 SSH ключ

### Публичный ключ для добавления на сервер:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIERnjhlBuT0tfT8zjLLN+85g/m/5522Fe7YA9dCvSm9m shop-deploy-key
```

### Приватный ключ (добавить в GitHub Secrets):
```
-----BEGIN OPENSSH PRIVATE KEY-----
[Содержимое файла ~/.ssh/shop_deploy_key]
-----END OPENSSH PRIVATE KEY-----
```

## 🖥️ Настройка сервера

### 1. Подключитесь к серверу и выполните:

```bash
# Скачайте и запустите скрипт настройки
curl -fsSL https://raw.githubusercontent.com/your-repo/shop/main/scripts/setup-server.sh | sudo bash
```

### 2. Добавьте SSH ключ:

```bash
# Создайте директорию .ssh если её нет
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Добавьте публичный ключ
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIERnjhlBuT0tfT8zjLLN+85g/m/5522Fe7YA9dCvSm9m shop-deploy-key" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Скопируйте проект:

```bash
# Клонируйте репозиторий
cd /opt
git clone https://github.com/your-repo/shop.git
cd shop

# Настройте SSL сертификаты
./scripts/setup-ssl.sh
```

## 🔧 Настройка GitHub Secrets

Добавьте в настройках репозитория (Settings → Secrets and variables → Actions):

```
HOST=185.211.170.182
USERNAME=your-username
SSH_KEY=[содержимое приватного ключа]
PORT=22
```

## 🌐 Настройка домена

### 1. DNS записи

Добавьте A запись:
```
knivesspb.fluttium.com → 185.211.170.182
```

### 2. SSL сертификаты

Для продакшена замените самоподписанные сертификаты на Let's Encrypt:

```bash
# Установите certbot
sudo apt install certbot

# Получите сертификат
sudo certbot certonly --standalone -d knivesspb.fluttium.com

# Скопируйте сертификаты
sudo cp /etc/letsencrypt/live/knivesspb.fluttium.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/knivesspb.fluttium.com/privkey.pem nginx/ssl/key.pem
sudo chown $USER:$USER nginx/ssl/*
```

## 🚀 Первый деплой

### 1. Вручную:

```bash
cd /opt/shop
./scripts/deploy.sh
```

### 2. Через GitHub Actions:

Просто сделайте push в `main` ветку - деплой запустится автоматически.

## 📊 Мониторинг

### Проверка статуса:

```bash
# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Логи
docker-compose -f docker-compose.prod.yml logs -f

# Использование ресурсов
docker stats
```

### Health checks:

- API: `https://knivesspb.fluttium.com/health`
- Web: `https://knivesspb.fluttium.com/`

## 🔧 Управление

### Команды systemd:

```bash
# Запуск
sudo systemctl start shop

# Остановка
sudo systemctl stop shop

# Статус
sudo systemctl status shop

# Автозапуск
sudo systemctl enable shop
```

### Команды Docker:

```bash
# Перезапуск
docker-compose -f docker-compose.prod.yml restart

# Обновление
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Очистка
docker system prune -f
```

## 🛠️ Troubleshooting

### Проблемы с подключением:

```bash
# Проверка портов
netstat -tlnp | grep 1488

# Проверка firewall
sudo ufw status

# Проверка nginx
docker-compose -f docker-compose.prod.yml logs nginx
```

### Проблемы с базой данных:

```bash
# Проверка подключения
docker-compose -f docker-compose.prod.yml exec api npx prisma db push

# Миграции
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

### Проблемы с SSL:

```bash
# Проверка сертификатов
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Обновление Let's Encrypt
sudo certbot renew
```

## 📈 Масштабирование

### Увеличение ресурсов:

Отредактируйте `docker-compose.prod.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 2G  # Увеличьте при необходимости
      cpus: '1.0'
```

### Мониторинг ресурсов:

```bash
# Использование диска
df -h

# Использование памяти
free -h

# Использование CPU
htop
```

## 🔒 Безопасность

### Рекомендации:

1. Регулярно обновляйте систему
2. Используйте сильные пароли
3. Ограничьте доступ к SSH
4. Настройте fail2ban
5. Регулярно обновляйте SSL сертификаты

### Firewall:

```bash
# Проверка открытых портов
sudo ufw status verbose

# Дополнительные правила
sudo ufw deny 22/tcp  # Отключить SSH если не нужен
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs`
2. Проверьте статус: `docker-compose -f docker-compose.prod.yml ps`
3. Проверьте ресурсы: `docker stats`
4. Обратитесь к документации в `DOCKER_README.md`
