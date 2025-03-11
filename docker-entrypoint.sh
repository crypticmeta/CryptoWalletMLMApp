#!/bin/bash
set -e

# Generate application key if not set
php artisan key:generate --no-interaction --force

# Run database migrations (uncomment to enable)
php artisan migrate --force

# php artisan db:seed

# Ensure storage directories exist with proper permissions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
chmod -R 775 /var/www/html/storage
chown -R www-data:www-data /var/www/html/storage

# Cache configuration for better performance
php artisan config:cache
php artisan route:cache
# php artisan view:cache  # Commented out to avoid the error

# Start Apache
exec apache2-foreground