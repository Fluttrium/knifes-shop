#!/bin/bash

# Скрипт для настройки сервера
# Использование: ./scripts/setup-server.sh

set -e

echo "🖥️  Setting up server for shop application..."

# Проверяем, что мы root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root"
    exit 1
fi

# Обновляем систему
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Устанавливаем Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $SUDO_USER
else
    echo "✅ Docker already installed"
fi

# Устанавливаем Docker Compose
echo "📦 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose already installed"
fi

# Создаем директорию проекта
echo "📁 Creating project directory..."
mkdir -p /opt/shop
chown $SUDO_USER:$SUDO_USER /opt/shop

# Создаем директорию для логов
echo "📝 Creating logs directory..."
mkdir -p /var/log/shop
chown $SUDO_USER:$SUDO_USER /var/log/shop

# Настраиваем firewall (если ufw установлен)
if command -v ufw &> /dev/null; then
    echo "🔥 Configuring firewall..."
    ufw allow 22/tcp
    ufw allow 1488/tcp
    ufw allow 1443/tcp
    ufw --force enable
fi

# Создаем systemd service для автозапуска
echo "⚙️  Creating systemd service..."
cat > /etc/systemd/system/shop.service << EOF
[Unit]
Description=Shop Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/shop
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Включаем автозапуск
systemctl enable shop.service

echo "✅ Server setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your project files to /opt/shop"
echo "2. Add your SSH public key to ~/.ssh/authorized_keys"
echo "3. Configure SSL certificates: ./scripts/setup-ssl.sh"
echo "4. Start the application: systemctl start shop"
echo ""
echo "🔑 SSH Public Key to add:"
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIERnjhlBuT0tfT8zjLLN+85g/m/5522Fe7YA9dCvSm9m shop-deploy-key"
