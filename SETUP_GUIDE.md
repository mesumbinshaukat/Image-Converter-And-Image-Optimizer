# Imgify Setup & Troubleshooting Guide

## MySQL PDO Driver Issue (Current Error)

### Problem
The error `could not find driver` indicates that the MySQL PDO extension is not enabled in your PHP installation.

### Solution

1. **Locate your `php.ini` file**:
   - For XAMPP on Windows: `C:\xampp\php\php.ini`
   - You can also find it by running: `php --ini`

2. **Edit `php.ini`**:
   - Open the file in a text editor (as Administrator)
   - Find these lines (they might be commented out with `;`):
     ```ini
     ;extension=pdo_mysql
     ;extension=mysqli
     ```
   
3. **Uncomment the extensions** (remove the `;`):
     ```ini
     extension=pdo_mysql
     extension=mysqli
     ```

4. **Restart Apache** in XAMPP Control Panel

5. **Verify the fix**:
   ```bash
   php -m | findstr pdo
   ```
   You should see `pdo_mysql` in the output.

6. **Run migrations again**:
   ```bash
   cd backend
   php artisan migrate:fresh
   php artisan db:seed
   ```

## Complete Setup Steps

### 1. Enable PHP Extensions

Edit `C:\xampp\php\php.ini` and ensure these extensions are enabled:

```ini
extension=pdo_mysql
extension=mysqli
extension=gd
extension=fileinfo
extension=mbstring
extension=openssl
```

**For ImageMagick support** (required for high-quality image processing):
```ini
extension=imagick
```

If you don't have ImageMagick installed:
1. Download from: https://windows.php.net/downloads/pecl/releases/imagick/
2. Extract `php_imagick.dll` to `C:\xampp\php\ext\`
3. Add `extension=imagick` to php.ini
4. Restart Apache

### 2. Create Database

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "New" in the left sidebar
3. Database name: `imgify`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

### 3. Configure Environment

Edit `backend/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=imgify
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Run Migrations

```bash
cd backend
php artisan migrate:fresh
php artisan db:seed
php artisan storage:link
```

### 5. Install Sanctum

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 6. Start Servers

**Backend** (Terminal 1):
```bash
cd backend
php artisan serve
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

## Testing the Application

### 1. Test Image Optimization

1. Navigate to: http://localhost:3000
2. Upload test images from `Testing-Images` folder
3. Click "Optimize"
4. Verify file size reduction
5. Download optimized images

### 2. Test Image Conversion

1. Navigate to converter page
2. Upload images
3. Select target format (e.g., PNG to JPG)
4. Convert and download

### 3. Test Rate Limiting

**Guest User**:
- Try uploading 6 images at once (should fail - limit is 5)
- Upload 5 images multiple times until daily limit (20) is reached

**Registered User**:
- Login with admin credentials
- Upload up to 50 images at once
- Daily limit: 500 images

### 4. Test Admin Dashboard

1. Navigate to: http://localhost:3000/admin-access
2. Login:
   - Email: mesum@worldoftech.company
   - Password: admin123
3. Verify dashboard displays:
   - User list
   - Daily statistics
   - Activity logs

## Common Issues & Solutions

### Issue: "Class 'Imagick' not found"

**Solution**: Install ImageMagick extension (see step 1 above)

**Alternative**: Use GD driver instead
- Edit `backend/app/Services/ImageOptimizationService.php`
- Change: `use Intervention\Image\Drivers\Imagick\Driver;`
- To: `use Intervention\Image\Drivers\Gd\Driver;`

### Issue: "Storage link already exists"

**Solution**:
```bash
# Remove existing link
Remove-Item backend/public/storage
# Create new link
php artisan storage:link
```

### Issue: "Access denied for user 'root'@'localhost'"

**Solution**: Check MySQL is running in XAMPP and password is correct in `.env`

### Issue: CORS errors in frontend

**Solution**: Add to `backend/config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

### Issue: Images not uploading

**Solution**: Check `php.ini` upload limits:
```ini
upload_max_filesize = 20M
post_max_size = 20M
max_execution_time = 300
```

## Production Deployment Checklist

### Backend

1. ✅ Set `APP_ENV=production` in `.env`
2. ✅ Set `APP_DEBUG=false` in `.env`
3. ✅ Configure production database
4. ✅ Set up SSL certificate
5. ✅ Configure mail server (SMTP)
6. ✅ Set up cron jobs:
   ```bash
   * * * * * cd /path-to-project/backend && php artisan schedule:run >> /dev/null 2>&1
   ```
7. ✅ Cache configuration:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
8. ✅ Optimize autoloader:
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

### Frontend

1. ✅ Update API URL in `frontend/src/services/api.ts`
2. ✅ Build for production:
   ```bash
   npm run build
   ```
3. ✅ Deploy `dist` folder to web server
4. ✅ Configure web server (Nginx/Apache) for SPA routing

### Security

1. ✅ Change admin password
2. ✅ Update `APP_KEY` in production
3. ✅ Configure CORS for production domain
4. ✅ Enable HTTPS
5. ✅ Set up firewall rules
6. ✅ Configure rate limiting
7. ✅ Enable security headers

## Performance Optimization

### Backend

```bash
# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Enable OPcache in php.ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
```

### Frontend

```bash
# Build with optimizations
npm run build

# Analyze bundle size
npm run build -- --analyze
```

### Database

```sql
-- Add indexes for better performance
CREATE INDEX idx_images_expires_at ON images(expires_at);
CREATE INDEX idx_images_created_at ON images(created_at);
CREATE INDEX idx_rate_limits_ip ON rate_limits(ip_address);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);
```

## Scheduled Tasks

The application requires cron jobs for automated cleanup:

```bash
# Edit crontab
crontab -e

# Add this line
* * * * * cd /path-to-project/backend && php artisan schedule:run >> /dev/null 2>&1
```

**Tasks that run automatically**:
- Delete images older than 24 hours (daily at midnight)
- Clean activity logs older than 24 hours (daily at midnight)
- Reset daily usage counters (daily at midnight)

## API Testing

Use the provided test images in `Testing-Images` folder:

```bash
# Test optimization
curl -X POST http://localhost:8000/api/optimize \
  -F "images[]=@Testing-Images/sample1.jpg" \
  -F "quality=85"

# Test conversion
curl -X POST http://localhost:8000/api/convert \
  -F "images[]=@Testing-Images/sample1.jpg" \
  -F "format=png"
```

## Monitoring & Logs

### Laravel Logs
```bash
tail -f backend/storage/logs/laravel.log
```

### Activity Logs
Check admin dashboard or database table `activity_logs`

### Error Tracking
All errors are logged with:
- IP address
- User (if authenticated)
- Error message
- Stack trace
- Timestamp

## Backup Strategy

### Database Backup
```bash
# Export database
mysqldump -u root -p imgify > backup_$(date +%Y%m%d).sql

# Import database
mysql -u root -p imgify < backup_20241123.sql
```

### File Backup
```bash
# Backup uploaded images
tar -czf images_backup_$(date +%Y%m%d).tar.gz backend/storage/app/public/images
```

## Support

For issues or questions:
- Email: mesum@worldoftech.company
- Developer: World Of Tech (https://worldoftech.company)

## Next Steps

After fixing the MySQL PDO driver issue:

1. ✅ Run migrations: `php artisan migrate:fresh`
2. ✅ Seed database: `php artisan db:seed`
3. ✅ Create storage link: `php artisan storage:link`
4. ✅ Start backend: `php artisan serve`
5. ✅ Start frontend: `npm run dev`
6. ✅ Test with sample images
7. ✅ Access admin dashboard
8. ✅ Complete frontend implementation (see IMPLEMENTATION_GUIDE.md)
