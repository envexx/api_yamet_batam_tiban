# Home Page System Status Display

## Overview
Halaman utama (`/`) backend YAMET telah diperbarui untuk menampilkan status sistem secara real-time, termasuk koneksi database, status API, dan informasi sistem lainnya.

## Fitur Utama

### 1. System Status Monitoring
- **Database Connection**: Menampilkan status koneksi database (Connected/Disconnected)
- **API Health**: Status kesehatan API (Healthy/Unhealthy)
- **Environment**: Environment yang sedang berjalan (development/production)
- **Version**: Versi aplikasi
- **Uptime**: Waktu berjalan server
- **Memory Usage**: Penggunaan memory aplikasi
- **Node.js Version**: Versi Node.js yang digunakan
- **Platform**: Platform server (Linux/Windows/macOS)

### 2. Real-time Status Check
- Status diperbarui setiap kali halaman dimuat
- Tombol refresh untuk memeriksa status ulang
- Loading indicator saat memeriksa status

### 3. API Endpoints Information
- Daftar endpoint API yang tersedia
- Method HTTP untuk setiap endpoint
- Deskripsi fungsi setiap endpoint

### 4. Quick Actions
- Link langsung ke endpoint penting:
  - Health Check (`/api/health`)
  - Children Data (`/api/anak`)
  - Dashboard Stats (`/api/dashboard/stats`)

## Komponen

### Frontend (`app/page.tsx`)
```typescript
interface SystemStatus {
  database: 'connected' | 'disconnected' | 'checking' | 'unknown';
  api: 'healthy' | 'unhealthy' | 'checking';
  timestamp: string;
  version: string;
  environment: string;
  uptime?: number;
  memory?: any;
  nodeVersion?: string;
  platform?: string;
}
```

### Backend (`app/api/health/route.ts`)
Endpoint health yang diperbarui untuk memberikan informasi lengkap:
- Database connection test
- System information
- Memory usage
- API endpoints list

## Styling (`app/page.module.css`)

### Design Features
- **Modern UI**: Gradient background dengan card-based layout
- **Responsive**: Optimized untuk desktop dan mobile
- **Color-coded Status**: 
  - 🟢 Green: Healthy/Connected
  - 🔴 Red: Unhealthy/Disconnected
  - 🟡 Yellow: Checking
- **Interactive Elements**: Hover effects dan animations

### Responsive Breakpoints
- **Desktop**: Full layout dengan grid 2-3 kolom
- **Tablet (768px)**: Single column layout
- **Mobile (480px)**: Compact layout dengan font size yang disesuaikan

## Cara Kerja

### 1. Page Load
```typescript
useEffect(() => {
  const checkSystemStatus = async () => {
    const healthResponse = await fetch('/api/health');
    const healthData = await healthResponse.json();
    // Update status state
  };
  checkSystemStatus();
}, []);
```

### 2. Database Check
```typescript
// Di backend health endpoint
try {
  await prisma.$queryRaw`SELECT 1`;
  databaseStatus = 'connected';
} catch (dbError) {
  databaseStatus = 'disconnected';
}
```

### 3. Status Display
- Status ditampilkan dengan warna yang sesuai
- Informasi real-time dari server
- Format waktu lokal Indonesia

## Error Handling

### Frontend
- Loading state saat memeriksa status
- Error state jika gagal mengambil data
- Fallback values untuk data yang tidak tersedia

### Backend
- Try-catch untuk database connection
- Graceful error handling
- Detailed error messages

## Production Considerations

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: Database connection string
- `CORS_ORIGIN`: Allowed origins

### Performance
- Single API call untuk semua status
- Caching tidak diperlukan (real-time status)
- Minimal JavaScript untuk fast loading

## Testing

### Manual Testing
1. Buka halaman `/`
2. Periksa status database dan API
3. Klik tombol refresh
4. Test responsive design di berbagai ukuran layar

### API Testing
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": {
    "status": "connected",
    "provider": "PostgreSQL"
  },
  "api": {
    "baseUrl": "https://api.yametbatamtiban.id",
    "endpoints": { ... }
  },
  "system": {
    "nodeVersion": "v18.x.x",
    "platform": "linux"
  }
}
```

## Maintenance

### Regular Checks
- Monitor database connection status
- Check API response times
- Review memory usage patterns
- Update version information

### Troubleshooting
1. **Database Disconnected**: Periksa DATABASE_URL dan koneksi database
2. **API Unhealthy**: Periksa logs dan dependencies
3. **Memory High**: Monitor memory usage dan optimize jika perlu

## Future Enhancements

### Potential Improvements
- Real-time WebSocket updates
- Historical status tracking
- Email/SMS alerts untuk status critical
- Detailed performance metrics
- Custom status thresholds

### Monitoring Integration
- Integration dengan monitoring tools (New Relic, DataDog)
- Custom health check endpoints
- Automated alerting system 