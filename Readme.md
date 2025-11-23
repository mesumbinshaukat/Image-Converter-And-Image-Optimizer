# Imgify - Image Optimizer & Converter

![Imgify Logo](https://via.placeholder.com/800x200/6366f1/ffffff?text=Imgify+-+Image+Optimizer+%26+Converter)

**Imgify** is a professional web application for optimizing and converting images online. Built with Laravel and React, it provides high-quality image compression and format conversion with a user-friendly interface.

## 🌟 Features

### Image Optimization
- **Lossless Compression**: Reduce image file size by up to 80% without visible quality loss
- **Metadata Removal**: Automatically strip EXIF, IPTC, and XMP data for privacy and size reduction
- **Format Support**: JPG, PNG, WebP, GIF, BMP
- **Batch Processing**: Process multiple images simultaneously

### Image Conversion
- **Multi-Format Support**: Convert between JPG, PNG, WebP, GIF, BMP, SVG
- **Quality Preservation**: Maintain image quality during format conversion
- **Batch Conversion**: Convert multiple images at once

### User Management
- **Guest Access**: 5 images per batch, 20 images per day
- **Registered Users**: 50 images per batch, 500 images per day
- **Admin Dashboard**: Comprehensive analytics and user management

### Security & Performance
- **Rate Limiting**: IP-based tracking to prevent abuse
- **DDoS Protection**: Built-in security measures
- **SQL Injection Prevention**: Secure database queries
- **Bot Protection**: Honeypot fields in contact forms
- **24-Hour File Retention**: Automatic cleanup of processed images

### SEO Optimized
- **Meta Tags**: Comprehensive SEO meta tags
- **Structured Data**: Schema.org markup for search engines
- **Google AdSense Ready**: Optimized for ad placement
- **Performance**: Fast loading times and optimized assets

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 10.x
- **Authentication**: Laravel Sanctum
- **Image Processing**: Intervention Image with Imagick driver
- **Database**: MySQL (via XAMPP)
- **PHP Version**: 8.1+

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios

## 📋 Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 20.x or higher
- npm or yarn
- XAMPP (for local development)
- ImageMagick (for image processing)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Image-Converter-And-Image-Optimizer
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# DB_DATABASE=imgify
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Seed admin user
php artisan db:seed

# Create storage link
php artisan storage:link

# Install Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Start Backend Server

```bash
cd backend
php artisan serve
```

The backend will run on `http://localhost:8000` and frontend on `http://localhost:3000`.

## 🗄️ Database Setup

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `imgify`
3. Run migrations: `php artisan migrate`
4. Seed admin user: `php artisan db:seed`

## 👤 Admin Credentials

- **Email**: mesum@worldoftech.company
- **Password**: admin123
- **Username**: Mesum

Access admin dashboard at: `http://localhost:3000/admin-access`

## 📁 Project Structure

```
Image-Converter-And-Image-Optimizer/
├── backend/                    # Laravel backend
│   ├── app/
│   │   ├── Models/            # Eloquent models
│   │   ├── Services/          # Business logic services
│   │   ├── Http/
│   │   │   ├── Controllers/   # API controllers
│   │   │   └── Middleware/    # Custom middleware
│   │   └── Console/           # Artisan commands
│   ├── config/                # Configuration files
│   ├── database/
│   │   ├── migrations/        # Database migrations
│   │   └── seeders/           # Database seeders
│   └── routes/                # API routes
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # Redux store
│   │   └── utils/             # Utility functions
│   └── public/                # Static assets
│
└── Testing-Images/            # Sample images for testing
```

## 🔧 Configuration

### Rate Limits

Edit `backend/.env` to customize rate limits:

```env
IMGIFY_GUEST_BATCH_LIMIT=5
IMGIFY_GUEST_DAILY_LIMIT=20
IMGIFY_USER_BATCH_LIMIT=50
IMGIFY_USER_DAILY_LIMIT=500
```

### File Retention

```env
IMGIFY_FILE_RETENTION_HOURS=24
IMGIFY_LOG_RETENTION_HOURS=24
```

### Image Processing

```env
IMGIFY_MAX_FILE_SIZE=10240  # in KB
IMGIFY_ALLOWED_FORMATS=jpg,jpeg,png,webp,gif,bmp,svg
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
php artisan test
```

### Test with Sample Images

Use the images in the `Testing-Images` folder to test:
- Image optimization
- Format conversion
- Batch processing
- Rate limiting

## 📝 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/forgot-password` - Password reset request

### Image Processing
- `POST /api/optimize` - Optimize images
- `POST /api/convert` - Convert image formats
- `GET /api/download/{id}` - Download processed image

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/logs` - View activity logs

### Contact
- `POST /api/contact` - Submit contact form

## 🔒 Security Features

- ✅ CSRF Protection
- ✅ SQL Injection Prevention
- ✅ XSS Protection
- ✅ Rate Limiting
- ✅ IP-based Tracking
- ✅ File Upload Validation
- ✅ Honeypot Bot Protection
- ✅ Secure Password Hashing

## 📊 SEO Features

- ✅ Meta Tags (Title, Description, Keywords)
- ✅ Open Graph Tags
- ✅ Twitter Cards
- ✅ Schema.org Structured Data
- ✅ Canonical URLs
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Google AdSense Ready

## 🔄 Scheduled Tasks

The application includes automated cleanup tasks:

```bash
# Add to crontab for production
* * * * * cd /path-to-project/backend && php artisan schedule:run >> /dev/null 2>&1
```

Tasks:
- Delete images older than 24 hours
- Clean up activity logs older than 24 hours
- Reset daily usage counters

## 🌐 Deployment

### Production Checklist

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false` in `.env`
3. Configure production database
4. Set up cron jobs for scheduled tasks
5. Configure mail server for password resets
6. Set up SSL certificate
7. Configure CORS for production domain
8. Optimize assets: `npm run build`
9. Cache configuration: `php artisan config:cache`
10. Cache routes: `php artisan route:cache`

## 👨‍💻 Developer

**World Of Tech**  
Website: [https://worldoftech.company](https://worldoftech.company)

## 📄 License

Proprietary - All rights reserved © 2024 World Of Tech

## 🤝 Support

For support, email: mesum@worldoftech.company

## 🎯 Roadmap

- [ ] Mobile app (iOS/Android)
- [ ] API for third-party integrations
- [ ] Advanced image editing features
- [ ] Cloud storage integration
- [ ] Bulk processing via API
- [ ] Premium subscription plans

---

**Made with ❤️ by World Of Tech**
