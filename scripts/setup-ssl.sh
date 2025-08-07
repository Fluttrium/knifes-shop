#!/bin/bash

# Скрипт для настройки SSL сертификатов
# Использование: ./scripts/setup-ssl.sh

set -e

echo "🔐 Setting up SSL certificates..."

# Создаем директорию для SSL
mkdir -p nginx/ssl

# Проверяем наличие существующих сертификатов
if [ -f "nginx/ssl/cert.pem" ] && [ -f "nginx/ssl/key.pem" ]; then
    echo "✅ SSL certificates already exist"
    echo "📋 Certificate info:"
    openssl x509 -in nginx/ssl/cert.pem -text -noout | grep -E "(Subject:|Not After)"
    exit 0
fi

echo "📝 Generating self-signed certificate for development..."

# Генерируем самоподписанный сертификат
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=RU/ST=SPB/L=Saint Petersburg/O=Fluttium/OU=IT/CN=knivesspb.fluttium.com"

echo "✅ SSL certificates generated successfully!"
echo "📁 Location: nginx/ssl/"
echo "🔑 Key: nginx/ssl/key.pem"
echo "📜 Cert: nginx/ssl/cert.pem"

# Показываем информацию о сертификате
echo "📋 Certificate info:"
openssl x509 -in nginx/ssl/cert.pem -text -noout | grep -E "(Subject:|Not After)"

echo ""
echo "⚠️  Note: This is a self-signed certificate for development."
echo "   For production, replace with a valid SSL certificate from Let's Encrypt or your CA."
