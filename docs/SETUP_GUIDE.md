# Waddle v2 - Complete Setup Guide

> Everything you need to get the project running locally and in production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Required API Keys & Accounts](#required-api-keys--accounts)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Running the Project](#running-the-project)
7. [Production Deployment](#production-deployment)

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

### Optional (Recommended)

| Software | Purpose |
|----------|---------|
| [Laravel Herd](https://herd.laravel.com/) | Easy PHP/Laravel environment (Mac) |
| [DBngin](https://dbngin.com/) | Easy MySQL management (Mac) |
| [TablePlus](https://tableplus.com/) | Database GUI |
| [Postman](https://www.postman.com/) | API testing |

---

## Required API Keys & Accounts

### 1. Stripe (Payments) ⭐ Required

**What it's for:** Processing token purchases and subscriptions

**Sign up:** [dashboard.stripe.com/register](https://dashboard.stripe.com/register)

**Steps:**
1. Create a Stripe account
2. Go to **Developers → API Keys**
3. Copy your keys:
   - `Publishable key` (starts with `pk_test_` or `pk_live_`)
   - `Secret key` (starts with `sk_test_` or `sk_live_`)
4. For webhooks: **Developers → Webhooks → Add endpoint**
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`
   - Copy the **Webhook signing secret** (starts with `whsec_`)

**Keys needed:**
```
STRIPE_KEY=pk_test_xxxxx
STRIPE_SECRET=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

### 2. Zoom Video SDK (Video Calls) ⭐ Required for consultations

**What it's for:** Real-time video consultations between users and consultants

**Sign up:** [marketplace.zoom.us](https://marketplace.zoom.us/)

**Steps:**
1. Sign in with your Zoom account (or create one)
2. Go to **Develop → Build App**
3. Choose **Video SDK** (not Meeting SDK)
4. Click **Create**
5. Fill in app details:
   - App Name: "Waddle"
   - Company Name: Your company
   - Developer Contact: Your email
6. Go to **App Credentials**
7. Copy your keys:
   - `SDK Key` (also called Client ID)
   - `SDK Secret` (also called Client Secret)

**Keys needed:**
```
ZOOM_SDK_KEY=xxxxx
ZOOM_SDK_SECRET=xxxxx
```

**Note:** For MVP, you can skip this and the video features will be simulated.

---

### 3. AWS S3 (File Storage) ⭐ Required for attachments

**What it's for:** Storing user profile photos, problem attachments, consultation files

**Sign up:** [aws.amazon.com](https://aws.amazon.com/)

**Steps:**
1. Create an AWS account
2. Go to **IAM → Users → Create User**
   - User name: `waddle-app`
   - Attach policy: `AmazonS3FullAccess` (or create a more restrictive policy)
   - Create access key → Application running outside AWS
   - Copy `Access Key ID` and `Secret Access Key`
3. Go to **S3 → Create Bucket**
   - Bucket name: `waddle-uploads` (or your choice)
   - Region: Choose closest to your users
   - Uncheck "Block all public access" (we'll use signed URLs)
   - Create bucket
4. Configure CORS on the bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
       "ExposeHeaders": []
     }
   ]
   ```

**Keys needed:**
```
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=waddle-uploads
```

**Alternative:** Use [Cloudflare R2](https://www.cloudflare.com/products/r2/) (S3-compatible, generous free tier)

---

### 4. Email Service (Notifications) ⭐ Required

**What it's for:** Sending registration confirmations, notifications, password resets

**Option A: SendGrid (Recommended)**

1. Sign up: [sendgrid.com](https://sendgrid.com/)
2. Go to **Settings → API Keys → Create API Key**
3. Give it "Full Access" or "Mail Send" permission
4. Copy the API key

```
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.xxxxx (your API key)
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="Waddle"
```

**Option B: AWS SES**

1. Go to **Amazon SES** in AWS Console
2. Verify your domain or email address
3. Create SMTP credentials
4. Use the credentials in your `.env`

**Option C: Mailtrap (Development Only)**

1. Sign up: [mailtrap.io](https://mailtrap.io/)
2. Get credentials from your inbox settings
3. All emails are caught and viewable in Mailtrap (never actually sent)

```
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=xxxxx
MAIL_PASSWORD=xxxxx
```

---

### 5. Pusher (Real-time) - Optional for MVP

**What it's for:** Real-time notifications, live updates

**Sign up:** [pusher.com](https://pusher.com/)

**Steps:**
1. Create a Pusher account
2. Create a new **Channels** app
3. Go to **App Keys**
4. Copy all the keys

**Keys needed:**
```
PUSHER_APP_ID=xxxxx
PUSHER_APP_KEY=xxxxx
PUSHER_APP_SECRET=xxxxx
PUSHER_APP_CLUSTER=us2
```

**Alternative:** Self-host with [Laravel WebSockets](https://beyondco.de/docs/laravel-websockets) (free, but more setup)

---

### 6. Vercel (Frontend Hosting) - Free

**What it's for:** Hosting the React frontend

**Sign up:** [vercel.com](https://vercel.com/)

**Steps:**
1. Sign up with GitHub
2. Import your repository
3. Set root directory to `frontend`
4. Add environment variables (see below)
5. Deploy

---

### 7. Database Hosting (Production)

**Option A: PlanetScale (Recommended)**
- MySQL-compatible, serverless
- Generous free tier
- [planetscale.com](https://planetscale.com/)

**Option B: Railway**
- Simple MySQL hosting
- [railway.app](https://railway.app/)

**Option C: AWS RDS**
- Production-grade, more complex setup
- [aws.amazon.com/rds](https://aws.amazon.com/rds/)

---

## Environment Variables

### Backend (.env)

Create `backend/.env` from `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

Fill in these values:

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

# Sanctum (Frontend URL for CORS)
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost

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

# Pusher (Optional)
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=

# Queue (use 'sync' for dev, 'database' or 'redis' for prod)
QUEUE_CONNECTION=sync
```

### Frontend (.env)

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Waddle
VITE_STRIPE_KEY=pk_test_xxxxx
VITE_PUSHER_KEY=xxxxx
VITE_PUSHER_CLUSTER=us2
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

### Terminal 1: Backend

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend runs at: `http://localhost:8000`

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### Terminal 3: Queue Worker (Optional)

```bash
cd backend
php artisan queue:work
```

---

## Quick Start Checklist

### Minimum for MVP (UI Demo)

- [ ] PHP 8.2+ installed
- [ ] Node.js 18+ installed
- [ ] MySQL running
- [ ] Backend `.env` configured (APP_KEY, DB settings)
- [ ] Frontend `.env` configured (VITE_API_URL)
- [ ] Migrations run

### Full Features

- [ ] All minimum requirements
- [ ] Stripe account + keys
- [ ] Zoom SDK account + keys
- [ ] AWS S3 bucket + keys
- [ ] Email service configured
- [ ] Pusher (optional) for real-time

---

## Production Deployment

### Recommended Stack

| Service | Purpose | Cost |
|---------|---------|------|
| **Vercel** | Frontend hosting | Free tier available |
| **Railway** or **Render** | Backend hosting | ~$5-20/month |
| **PlanetScale** | Database | Free tier available |
| **AWS S3** | File storage | Pay per use (cheap) |
| **SendGrid** | Email | 100 emails/day free |
| **Stripe** | Payments | 2.9% + 30¢ per transaction |

### Environment Variables for Production

Remember to update:
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://api.your-domain.com`
- `SANCTUM_STATEFUL_DOMAINS=your-domain.com`
- `SESSION_DOMAIN=.your-domain.com`
- Use `pk_live_` and `sk_live_` Stripe keys

---

## Troubleshooting

### "CORS error" in browser
- Check `SANCTUM_STATEFUL_DOMAINS` includes your frontend URL
- Check `backend/config/cors.php` allows your origin

### "Unauthenticated" on API calls
- Ensure cookies are being sent (`withCredentials: true`)
- Check `SESSION_DOMAIN` matches your setup

### Stripe webhooks not working locally
- Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks:
  ```bash
  stripe listen --forward-to localhost:8000/api/stripe/webhook
  ```

### Emails not sending
- Check `MAIL_*` settings
- Use Mailtrap for development to catch all emails

---

## Support

If you get stuck:
1. Check Laravel logs: `backend/storage/logs/laravel.log`
2. Check browser console for frontend errors
3. Check network tab for API response details

