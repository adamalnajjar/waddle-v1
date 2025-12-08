#!/bin/bash

# Waddle Server Setup Script
# For Ubuntu 22.04 LTS
# Run as root or with sudo

set -e

echo "=========================================="
echo "  Waddle Server Setup Script"
echo "  Ubuntu 22.04 LTS"
echo "=========================================="

# Update system
echo ">>> Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo ">>> Installing required packages..."
apt install -y \
    nginx \
    mysql-server \
    php8.2-fpm \
    php8.2-cli \
    php8.2-mysql \
    php8.2-pgsql \
    php8.2-sqlite3 \
    php8.2-gd \
    php8.2-curl \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-zip \
    php8.2-bcmath \
    php8.2-intl \
    php8.2-readline \
    php8.2-redis \
    supervisor \
    git \
    curl \
    unzip

# Install Node.js 18 LTS
echo ">>> Installing Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Composer
echo ">>> Installing Composer..."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Install Certbot for SSL
echo ">>> Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Secure MySQL installation
echo ">>> Securing MySQL..."
mysql_secure_installation

# Create application directory
echo ">>> Creating application directory..."
mkdir -p /var/www/waddle
chown -R www-data:www-data /var/www/waddle

# Configure PHP-FPM
echo ">>> Configuring PHP-FPM..."
sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/' /etc/php/8.2/fpm/php.ini
sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 100M/' /etc/php/8.2/fpm/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 100M/' /etc/php/8.2/fpm/php.ini
systemctl restart php8.2-fpm

# Create MySQL database and user
echo ">>> Creating MySQL database..."
echo "Enter MySQL root password:"
read -s MYSQL_ROOT_PASS
mysql -u root -p"$MYSQL_ROOT_PASS" << EOF
CREATE DATABASE waddle CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'waddle'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON waddle.* TO 'waddle'@'localhost';
FLUSH PRIVILEGES;
EOF

# Setup Nginx
echo ">>> Setting up Nginx..."
# Copy your nginx.conf to /etc/nginx/sites-available/waddle
# ln -s /etc/nginx/sites-available/waddle /etc/nginx/sites-enabled/
# nginx -t && systemctl reload nginx

# Setup Supervisor
echo ">>> Setting up Supervisor..."
# Copy your supervisor.conf to /etc/supervisor/conf.d/waddle.conf
# supervisorctl reread
# supervisorctl update

# Setup firewall
echo ">>> Configuring firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo "=========================================="
echo "  Server setup completed!"
echo ""
echo "  Next steps:"
echo "  1. Clone your repository to /var/www/waddle"
echo "  2. Copy .env.example to .env and configure"
echo "  3. Copy deploy/nginx.conf to /etc/nginx/sites-available/waddle"
echo "  4. Update the domain name in nginx.conf"
echo "  5. Run: sudo ln -s /etc/nginx/sites-available/waddle /etc/nginx/sites-enabled/"
echo "  6. Run: sudo certbot --nginx -d your-domain.com"
echo "  7. Copy deploy/supervisor.conf to /etc/supervisor/conf.d/waddle.conf"
echo "  8. Run: sudo supervisorctl reread && sudo supervisorctl update"
echo "  9. Run ./deploy.sh to complete the setup"
echo "=========================================="
