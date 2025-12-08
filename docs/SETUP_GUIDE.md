# Waddle v2 - Complete Setup Guide

> Everything you need to get the project running locally and in production.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Required API Keys & Accounts](#required-api-keys--accounts)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [Running the Project](#running-the-project)
8. [Production Deployment](#production-deployment)

---

## Architecture Overview

Waddle uses a **unified Laravel + Inertia.js** architecture:

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + TailwindCSS (via Inertia.js) |
| Backend | Laravel 11 + MySQL |
| Admin Panel | Filament (Laravel-native) |
| Real-time | Laravel WebSockets (Pusher-compatible) |
| Video | Zoom Video SDK |
| Payments | Stripe |
| File Storage | AWS S3 |

### Key Benefits
- **Single deployment** - Frontend and backend deploy together
- **No CORS issues** - Same origin for API and frontend
- **Server-side routing** - Laravel handles all routing
- **Session auth** - Standard Laravel session authentication
- **Simpler local dev** - One command to run everything

---

## Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| PHP | 8.2+ | [php.net](https://www.php.net/downloads) |
| Composer | 2.x | [getcomposer.org](https://getcomposer.org/download/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| npm | 9+ | Comes with Node.js |
| MySQL | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |

### Recommended (Local Development)

| Software | Purpose |
|----------|---------|
| [Laravel Herd](https://herd.laravel.com/) | Easy PHP/Laravel environment (Mac) |
| [DBngin](https://dbngin.com/) | Easy MySQL management (Mac) |
| [TablePlus](https://tableplus.com/) | Database GUI |

---

## Local Development Setup

### Option A: With Laravel Herd (Recommended for Mac)

1. **Install Laravel Herd** from [herd.laravel.com](https://herd.laravel.com/)

2. **Clone the repository:**
   ```bash
   cd ~/Herd
   git clone git@github.com:your-username/codename_waddle.git waddle
   cd waddle/backend
   ```

3. **Install dependencies:**
   ```bash
   composer install
   npm install
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Setup database:**
   - Create a MySQL database named `waddle`
   - Update `DB_*` settings in `.env`

6. **Run migrations and seeders:**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Access the app:**
   - Frontend: `http://waddle.test`
   - Admin: `http://waddle.test/admin`

### Option B: Without Herd

1. **Clone and setup:**
   ```bash
   git clone git@github.com:your-username/codename_waddle.git
   cd codename_waddle/backend
   composer install
   npm install
   cp .env.example .env
   php artisan key:generate
   ```

2. **Configure database in `.env`**

3. **Run migrations:**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1: PHP server
   php artisan serve

   # Terminal 2: Vite dev server (for hot reload)
   npm run dev
   ```

5. **Access the app:**
   - Frontend: `http://localhost:8000`
   - Admin: `http://localhost:8000/admin`

---

## Required API Keys & Accounts

### 1. Stripe (Payments) ⭐ Required

**Sign up:** [dashboard.stripe.com/register](https://dashboard.stripe.com/register)

**Keys needed:**
```env
STRIPE_KEY=pk_test_xxxxx
STRIPE_SECRET=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 2. Zoom Video SDK (Video Calls) ⭐ Required for consultations

**Sign up:** [marketplace.zoom.us](https://marketplace.zoom.us/)

**Keys needed:**
```env
ZOOM_SDK_KEY=xxxxx
ZOOM_SDK_SECRET=xxxxx
```

### 3. AWS S3 (File Storage) ⭐ Required for attachments

**Sign up:** [aws.amazon.com](https://aws.amazon.com/)

**Keys needed:**
```env
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=waddle-uploads
```

### 4. Email Service (Notifications) ⭐ Required

**Option A: SendGrid (Recommended)**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.xxxxx
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="Waddle"
```

**Option B: Mailtrap (Development Only)**
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=xxxxx
MAIL_PASSWORD=xxxxx
```

### 5. Pusher (Real-time) - Optional

**Sign up:** [pusher.com](https://pusher.com/)

**Keys needed:**
```env
PUSHER_APP_ID=xxxxx
PUSHER_APP_KEY=xxxxx
PUSHER_APP_SECRET=xxxxx
PUSHER_APP_CLUSTER=us2
```

---

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
# App
APP_NAME=Waddle
APP_ENV=local
APP_KEY=  # Run: php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=waddle
DB_USERNAME=root
DB_PASSWORD=

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Stripe
STRIPE_KEY=pk_test_xxxxx
STRIPE_SECRET=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Zoom
ZOOM_SDK_KEY=xxxxx
ZOOM_SDK_SECRET=xxxxx

# AWS S3
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=waddle-uploads

# Mail
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=xxxxx
MAIL_PASSWORD=xxxxx
MAIL_FROM_ADDRESS=noreply@waddle.com
MAIL_FROM_NAME="Waddle"

# Queue (use 'sync' for dev, 'database' for prod)
QUEUE_CONNECTION=sync

# Vite
VITE_APP_NAME="${APP_NAME}"
```

---

## Database Setup

### Local Development

1. **Create the database:**
   ```sql
   CREATE DATABASE waddle CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Run migrations:**
   ```bash
   cd backend
   php artisan migrate
   ```

3. **Seed initial data:**
   ```bash
   php artisan db:seed
   ```

---

## Running the Project

### Development (Single Command)

```bash
cd backend
composer run dev
```

This starts:
- PHP development server
- Vite dev server (hot reload)
- Queue worker
- Log watcher

### Manual Start

```bash
# Terminal 1: PHP server
cd backend
php artisan serve

# Terminal 2: Vite (hot reload)
cd backend
npm run dev

# Terminal 3: Queue (optional)
cd backend
php artisan queue:work
```

### Access Points

| URL | Description |
|-----|-------------|
| `http://localhost:8000` | Main application |
| `http://localhost:8000/admin` | Filament admin panel |

---

## Production Deployment

### Self-Hosted VPS (Ubuntu 22.04)

#### 1. Server Setup

```bash
# Copy setup script to server and run
scp backend/deploy/setup-server.sh user@server:/tmp/
ssh user@server
sudo bash /tmp/setup-server.sh
```

#### 2. Clone Repository

```bash
cd /var/www
sudo git clone git@github.com:your-username/codename_waddle.git waddle
cd waddle/backend
```

#### 3. Configure Environment

```bash
cp .env.example .env
nano .env  # Configure production settings
```

Update for production:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Use production Stripe keys
STRIPE_KEY=pk_live_xxxxx
STRIPE_SECRET=sk_live_xxxxx

# Use database queue
QUEUE_CONNECTION=database
```

#### 4. Setup Nginx

```bash
sudo cp backend/deploy/nginx.conf /etc/nginx/sites-available/waddle
sudo nano /etc/nginx/sites-available/waddle  # Update domain
sudo ln -s /etc/nginx/sites-available/waddle /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Setup SSL

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### 6. Setup Supervisor (Queue Workers)

```bash
sudo cp backend/deploy/supervisor.conf /etc/supervisor/conf.d/waddle.conf
sudo supervisorctl reread
sudo supervisorctl update
```

#### 7. Deploy

```bash
cd /var/www/waddle/backend
sudo bash deploy/deploy.sh production
```

### Deployment Checklist

- [ ] Server has PHP 8.2+, MySQL 8.0+, Node.js 18+
- [ ] `.env` configured with production values
- [ ] SSL certificate installed
- [ ] Queue workers running via Supervisor
- [ ] Cron job for Laravel scheduler
- [ ] Firewall configured (ports 80, 443)
- [ ] File permissions set correctly

---

## Troubleshooting

### "Page not found" after deployment
```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

### Assets not loading
```bash
npm run build
php artisan view:clear
```

### Queue jobs not processing
```bash
sudo supervisorctl status
sudo supervisorctl restart waddle-worker:*
```

### Check Laravel logs
```bash
tail -f storage/logs/laravel.log
```

---

## Support

If you get stuck:
1. Check Laravel logs: `backend/storage/logs/laravel.log`
2. Check Nginx logs: `/var/log/nginx/waddle_error.log`
3. Check Supervisor logs: `backend/storage/logs/worker.log`
