# راهنمای استقرار StockCity روی سرور (VPS)

این پروژه یک اپلیکیشن **Next.js 16** با دیتابیس داخلی **SQLite** است و هیچ سرویس خارجی لازم ندارد.
تصاویر محصولات و فایل دیتابیس روی دیسک سرور ذخیره می‌شوند، پس به یک VPS با **دیسک دائمی** نیاز دارید
(هر سرور لینوکسی مثل Ubuntu 22.04 مناسب است).

---

## ۱) پیش‌نیازهای سرور

با کاربر root یا یک کاربر با دسترسی sudo وارد سرور شوید:

```bash
# نصب Node.js نسخه 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# ابزارهای لازم برای کامپایل ماژول‌های نیتیو (better-sqlite3 و sharp)
sudo apt-get install -y build-essential python3 git

# بررسی نسخه‌ها
node -v   # باید v20.x باشد
npm -v
```

---

## ۲) گرفتن کد و نصب

```bash
# کلون پروژه (یا آپلود با scp/rsync)
cd /var/www
git clone <your-repo-url> stockcity
cd stockcity

# نصب پکیج‌ها
npm install
```

---

## ۳) تنظیم متغیرهای محیطی

```bash
cp .env.example .env.local
nano .env.local
```

مقادیر زیر را پر کنید:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=یک-رمز-قوی
AUTH_SECRET=یک-رشته-تصادفی-طولانی     # با دستور زیر بسازید
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
```

برای ساخت `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ۴) ساخت نسخه‌ی پروداکشن

```bash
npm run build
```

دیتابیس و تصاویر در این مسیرها ساخته می‌شوند (نباید پاک شوند):

```
/var/www/stockcity/data/stockcity.db     ← دیتابیس
/var/www/stockcity/public/products/      ← تصاویر محصولات
```

> در اولین اجرا، دیتابیس به‌صورت خودکار ساخته و با محصولات اولیه پر می‌شود.

---

## ۵) اجرای دائمی با PM2

PM2 برنامه را به‌صورت سرویس نگه می‌دارد و بعد از ری‌استارت سرور خودکار بالا می‌آید:

```bash
sudo npm install -g pm2

# اجرای برنامه روی پورت 3000
pm2 start "npm run start" --name stockcity

# ذخیره و فعال‌سازی اجرای خودکار بعد از ری‌بوت
pm2 save
pm2 startup    # دستوری که چاپ می‌کند را اجرا کنید
```

دستورات مفید:

```bash
pm2 logs stockcity      # مشاهده لاگ‌ها
pm2 restart stockcity   # ری‌استارت
pm2 status              # وضعیت
```

---

## ۶) Nginx به‌عنوان Reverse Proxy + دامنه

```bash
sudo apt-get install -y nginx
sudo nano /etc/nginx/sites-available/stockcity
```

محتوای فایل:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 20M;   # برای آپلود تصاویر

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

فعال‌سازی:

```bash
sudo ln -s /etc/nginx/sites-available/stockcity /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ۷) فعال‌سازی SSL رایگان (HTTPS)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

certbot به‌صورت خودکار گواهی را نصب و تمدید می‌کند.

---

## ۸) به‌روزرسانی پروژه در آینده

```bash
cd /var/www/stockcity
git pull
npm install
npm run build
pm2 restart stockcity
```

> دیتابیس و تصاویر دست‌نخورده باقی می‌مانند چون داخل پوشه‌های `data/` و `public/products/` هستند.

---

## ۹) پشتیبان‌گیری (Backup)

کل اطلاعات سایت در دو مسیر است؛ برای بکاپ کافی است این‌ها را کپی کنید:

```bash
# بکاپ دیتابیس و تصاویر
tar czf stockcity-backup-$(date +%F).tar.gz data/ public/products/
```

برای بکاپ خودکار روزانه می‌توانید این دستور را در crontab بگذارید.

---

## نکات مهم

- **حداقل ۱ گیگ رم** برای build کافی است؛ اگر رم کم بود یک swap موقت بسازید.
- پورت `3000` فقط داخلی است و از بیرون باز نمی‌شود؛ کاربر فقط از طریق Nginx (پورت ۸۰/۴۴۳) دسترسی دارد.
- پنل مدیریت در آدرس `/login` در دسترس است.
- فایل `.env.local` را هرگز در گیت قرار ندهید (در `.gitignore` هست).
