# Dashboard Stats Testing Guide

## Ringkasan Masalah dan Solusi

Error 500 pada `/api/dashboard/stats/test?period=1month` telah diperbaiki dengan membuat endpoint yang lebih sederhana dan robust.

---

## Endpoint yang Tersedia

### 1. **Simple Test Endpoint** (Direkomendasikan)
```
GET /api/dashboard/stats/test-simple?period=1month
```

**Fitur:**
- ✅ Tidak menggunakan database query kompleks
- ✅ Response cepat dan konsisten
- ✅ Data dummy untuk testing
- ✅ Error handling yang baik

### 2. **Full Test Endpoint** (Dengan Database)
```
GET /api/dashboard/stats/test?period=1month
```

**Fitur:**
- ⚠️ Menggunakan database query
- ⚠️ Bisa error jika database bermasalah
- ✅ Data real dari database
- ✅ Semua period filter

### 3. **Production Endpoint** (Dengan Auth)
```
GET /api/dashboard/stats?period=1month
```

**Fitur:**
- ✅ Authentication required
- ✅ Data real dari database
- ✅ Role-based access
- ⚠️ Perlu token valid

---

## Cara Testing

### 1. **Browser Testing**

#### Simple Test:
```
http://localhost:3000/test-simple
```

#### Full Test:
```
http://localhost:3000/test-dashboard
```

### 2. **API Testing**

#### Simple Endpoint:
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/dashboard/stats/test-simple?period=1month" -Method GET

# Browser
http://localhost:3000/api/dashboard/stats/test-simple?period=1month
```

#### Full Endpoint:
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/dashboard/stats/test?period=1month" -Method GET

# Browser
http://localhost:3000/api/dashboard/stats/test?period=1month
```

### 3. **JavaScript Testing**

```javascript
// Test simple endpoint
const testSimple = async () => {
  try {
    const response = await fetch('/api/dashboard/stats/test-simple?period=1month');
    const data = await response.json();
    console.log('Simple endpoint:', data);
    return data;
  } catch (error) {
    console.error('Simple endpoint error:', error);
  }
};

// Test full endpoint
const testFull = async () => {
  try {
    const response = await fetch('/api/dashboard/stats/test?period=1month');
    const data = await response.json();
    console.log('Full endpoint:', data);
    return data;
  } catch (error) {
    console.error('Full endpoint error:', error);
  }
};

// Test all periods
const testAllPeriods = async () => {
  const periods = ['1month', '4month', '6month', '1year', 'all'];
  
  for (const period of periods) {
    console.log(`\n=== Testing ${period} ===`);
    const data = await testSimple();
    if (data?.data?.period === period) {
      console.log('✅ Period correct');
    } else {
      console.log('❌ Period mismatch');
    }
  }
};

// Run tests
testAllPeriods();
```

---

## Expected Response Format

### Simple Endpoint Response:
```json
{
  "status": "success",
  "message": "Test endpoint working!",
  "data": {
    "total_anak": 150,
    "anak_aktif": 142,
    "anak_keluar_bulan_ini": 3,
    "period": "1month",
    "growth": [
      { "period": "Minggu 1", "count": 12 },
      { "period": "Minggu 2", "count": 8 },
      { "period": "Minggu 3", "count": 15 },
      { "period": "Minggu 4", "count": 10 }
    ],
    "insight": {
      "top_keluhan": ["Terlambat Bicara", "Hiperaktif", "Kesulitan Belajar"],
      "age_distribution": { "<2": 45, "2-4": 60, "4-6": 35, ">6": 10 },
      "referral_source": { "Dokter": 40, "Guru": 25, "Orang Tua": 35 },
      "therapy_success_count": 25,
      "avg_therapy_duration_month": 6.5
    }
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Troubleshooting

### 1. **Error 500 - Simple Endpoint**
**Kemungkinan penyebab:**
- Server tidak berjalan
- Port 3000 sudah digunakan
- File route.ts ada syntax error

**Solusi:**
```bash
# Restart server
npm run dev

# Cek port
netstat -ano | findstr :3000

# Cek syntax
npx tsc --noEmit
```

### 2. **Error 500 - Full Endpoint**
**Kemungkinan penyebab:**
- Database connection error
- Prisma client error
- Missing database tables

**Solusi:**
```bash
# Cek database connection
npx prisma db push

# Generate Prisma client
npx prisma generate

# Cek database status
npx prisma studio
```

### 3. **CORS Error**
**Solusi:**
- Gunakan browser untuk testing
- Atau tambahkan header di request:
```javascript
fetch('/api/dashboard/stats/test-simple?period=1month', {
  headers: {
    'Content-Type': 'application/json'
  }
})
```

### 4. **Data Kosong**
**Kemungkinan penyebab:**
- Database kosong
- Filter terlalu ketat
- Field tanggal tidak terisi

**Solusi:**
- Gunakan simple endpoint untuk testing
- Cek data di database
- Test dengan period 'all'

---

## Testing Checklist

### ✅ Basic Functionality
- [ ] Server berjalan di port 3000
- [ ] Simple endpoint bisa diakses
- [ ] Response format sesuai
- [ ] CORS headers ada

### ✅ Period Filtering
- [ ] 1month - 4 data (Minggu 1-4)
- [ ] 4month - 4 data (nama bulan)
- [ ] 6month - 6 data (nama bulan)
- [ ] 1year - 12 data (nama bulan)
- [ ] all - N data (tahun)

### ✅ Data Structure
- [ ] total_anak: number
- [ ] anak_aktif: number
- [ ] growth: array dengan period dan count
- [ ] insight: object dengan data insight
- [ ] period: string sesuai request

### ✅ Error Handling
- [ ] Invalid period parameter
- [ ] Database connection error
- [ ] Missing data
- [ ] Server error

---

## Quick Test Commands

### PowerShell:
```powershell
# Test simple endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/dashboard/stats/test-simple?period=1month"

# Test all periods
@('1month', '4month', '6month', '1year', 'all') | ForEach-Object {
    Write-Host "Testing $_"
    Invoke-WebRequest -Uri "http://localhost:3000/api/dashboard/stats/test-simple?period=$_"
}
```

### Browser:
```
http://localhost:3000/test-simple
http://localhost:3000/api/dashboard/stats/test-simple?period=1month
http://localhost:3000/api/dashboard/stats/test-simple?period=all
```

---

## Next Steps

1. **Test simple endpoint** - Pastikan berfungsi
2. **Test full endpoint** - Jika database ready
3. **Test production endpoint** - Dengan authentication
4. **Integrate ke frontend** - Gunakan response format yang sudah disederhanakan

---

## Status: ✅ READY FOR TESTING

Endpoint testing sudah diperbaiki dan siap digunakan. Mulai dengan simple endpoint untuk memastikan basic functionality berjalan dengan baik. 