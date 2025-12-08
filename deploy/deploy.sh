#!/bin/bash

# Waddle Deployment Script
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

# Configuration
APP_DIR="/var/www/waddle"
REPO_URL="git@github.com:your-username/codename_waddle.git"
BRANCH="${1:-main}"

echo "=========================================="
echo "  Waddle Deployment Script"
echo "  Environment: $BRANCH"
echo "=========================================="

cd $APP_DIR

# Enable maintenance mode
echo ">>> Enabling maintenance mode..."
php artisan down --retry=60

# Pull latest code
echo ">>> Pulling latest code from $BRANCH..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# Install/update PHP dependencies
echo ">>> Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Install/update Node dependencies and build assets
echo ">>> Building frontend assets..."
npm ci
npm run build

# Run database migrations
echo ">>> Running database migrations..."
php artisan migrate --force

# Clear and rebuild caches
echo ">>> Clearing and rebuilding caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Restart queue workers
echo ">>> Restarting queue workers..."
php artisan queue:restart

# Optimize
echo ">>> Running optimizations..."
php artisan optimize

# Fix permissions
echo ">>> Fixing permissions..."
sudo chown -R www-data:www-data $APP_DIR/storage
sudo chown -R www-data:www-data $APP_DIR/bootstrap/cache
sudo chmod -R 775 $APP_DIR/storage
sudo chmod -R 775 $APP_DIR/bootstrap/cache

# Disable maintenance mode
echo ">>> Disabling maintenance mode..."
php artisan up

echo "=========================================="
echo "  Deployment completed successfully!"
echo "=========================================="
