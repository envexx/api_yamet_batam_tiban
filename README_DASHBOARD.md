# Dashboard API Documentation - Frontend Guide

## 📊 Overview

Dokumentasi ini menjelaskan endpoint dashboard terbaru yang telah diintegrasikan dengan fitur normalisasi data dan statistik inputan admin. Semua data dashboard tersedia dalam satu endpoint utama.

## 🔐 Authentication & Authorization

### Endpoint Utama
```
GET /api/dashboard/stats
Authorization: Bearer <token>
```

### Role-based Access
- **SUPERADMIN**: Akses penuh ke semua data
- **MANAJER**: Akses penuh ke semua data  
- **ADMIN**: Akses terbatas (tanpa admin input stats)
- **TERAPIS**: Akses terbatas
- **ORANGTUA**: Akses terbatas

## 📋 Parameter Query

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | string | `month` | Periode waktu: `month`, `1month`, `4month`, `6month`, `1year`, `all` |

## 📊 Response Structure

### Success Response (200)
```json
{
  "status": "success",
  "message": "Dashboard statistics fetched successfully",
  "data": {
    // Data dasar untuk semua role
    "total_anak": 150,
    "anak_keluar_bulan_lalu": 5,
    "anak_keluar_bulan_ini": 3,
    "anak_aktif": 120,
    "growth": [...],
    "period": "all",
    "filter_applied": "all_time",
    
    // Data berdasarkan role
    "total_admin": 3,           // SUPERADMIN, MANAJER
    "total_terapis": 15,        // SUPERADMIN, MANAJER, ADMIN
    "total_manajer": 2,         // SUPERADMIN
    "total_orangtua": 100,      // Semua role
    
    // Statistik inputan admin (SUPERADMIN, MANAJER)
    "admin_input_stats": [
      {
        "admin_id": 1,
        "admin_name": "Admin Utama",
        "admin_email": "admin@yamet.com",
        "total_input": 75,
        "detail": {
          "anak": 20,
          "penilaian": 15,
          "program_terapi": 10,
          "jadwal_terapi": 15,
          "sesi_terapi": 10,
          "ebook": 3,
          "kursus": 2
        }
      }
    ],
    
    // Insight data (berdasarkan role)
    "insight": {
      "top_keluhan": [
        { "keluhan": "terlambat bicara", "count": 25 },
        { "keluhan": "hyperaktif", "count": 20 },
        { "keluhan": "kurang fokus", "count": 15 }
      ],
      "age_distribution": {
        "<2": 30,
        "2-4": 45,
        "4-6": 35,
        ">6": 40
      },
      "referral_source": {
        "google": 25,
        "instagram": 30,
        "teman": 15
      },
      "therapy_success_count": 25,
      "avg_therapy_duration_month": 6.5
    },
    
    // Data normalisasi (SUPERADMIN, MANAJER, ADMIN)
    "normalized_data": {
      "keluhan": {
        "raw_data": [
          { "keluhan": "sulit bicara", "count": 2 },
          { "keluhan": "terlambat bicara", "count": 3 }
        ],
        "normalized_data": [
          {
            "original": "sulit bicara, terlambat bicara",
            "normalized": "terlambat bicara",
            "count": 5
          }
        ],
        "formatted": "terlambat bicara\n5 kasus",
        "summary": {
          "total_unique_keluhan": 2,
          "total_normalized_keluhan": 1,
          "top_keluhan": {
            "normalized": "terlambat bicara",
            "count": 5
          }
        }
      },
      "sumber_informasi": {
        "raw_data": [
          { "sumber": "google", "count": 6 },
          { "sumber": "instagram", "count": 8 }
        ],
        "normalized_data": [
          {
            "original": "google, googling",
            "normalized": "internet",
            "count": 7
          },
          {
            "original": "instagram, ig",
            "normalized": "social media",
            "count": 9
          }
        ],
        "formatted": "social media\n9 kasus\n\ninternet\n7 kasus",
        "summary": {
          "total_unique_sumber": 2,
          "total_normalized_sumber": 2,
          "top_sumber": {
            "normalized": "social media",
            "count": 9
          }
        }
      }
    }
  }
}
```

## 🎯 Data yang Tersedia per Role

### SUPERADMIN
- ✅ Semua data dashboard
- ✅ Statistik inputan admin
- ✅ Data normalisasi keluhan & sumber
- ✅ Insight lengkap
- ✅ Growth data

### MANAJER
- ✅ Semua data dashboard
- ✅ Statistik inputan admin
- ✅ Data normalisasi keluhan & sumber
- ✅ Insight lengkap
- ✅ Growth data

### ADMIN
- ✅ Data dasar (total anak, status, dll)
- ✅ Data normalisasi keluhan & sumber
- ✅ Insight terbatas
- ❌ Statistik inputan admin

### TERAPIS
- ✅ Data dasar (total anak, status, dll)
- ✅ Insight terbatas
- ❌ Data normalisasi
- ❌ Statistik inputan admin

### ORANGTUA
- ✅ Data dasar (total anak, status, dll)
- ✅ Insight terbatas
- ❌ Data normalisasi
- ❌ Statistik inputan admin

## 📊 Komponen Dashboard yang Perlu Ditampilkan

### 1. Summary Cards
```javascript
const summaryCards = [
  {
    title: "Total Anak",
    value: data.total_anak,
    icon: "👶",
    color: "blue"
  },
  {
    title: "Anak Aktif",
    value: data.anak_aktif,
    icon: "✅",
    color: "green"
  },
  {
    title: "Anak Keluar Bulan Ini",
    value: data.anak_keluar_bulan_ini,
    icon: "📤",
    color: "orange"
  },
  {
    title: "Terapi Berhasil",
    value: data.insight.therapy_success_count,
    icon: "🎉",
    color: "purple"
  }
];
```

### 2. Top Keluhan Widget
```javascript
// Gunakan data normalisasi untuk display yang lebih bersih
const topKeluhanWidget = {
  title: "Top Keluhan",
  data: data.normalized_data.keluhan.formatted,
  summary: data.normalized_data.keluhan.summary,
  rawData: data.normalized_data.keluhan.raw_data,
  normalizedData: data.normalized_data.keluhan.normalized_data
};
```

### 3. Sumber Informasi Widget
```javascript
const sumberWidget = {
  title: "Sumber Informasi",
  data: data.normalized_data.sumber_informasi.formatted,
  summary: data.normalized_data.sumber_informasi.summary,
  rawData: data.normalized_data.sumber_informasi.raw_data,
  normalizedData: data.normalized_data.sumber_informasi.normalized_data
};
```

### 4. Admin Input Stats (SUPERADMIN & MANAJER)
```javascript
const adminStatsWidget = {
  title: "Statistik Inputan Admin",
  data: data.admin_input_stats,
  summary: {
    totalAdmin: data.admin_input_stats.length,
    totalInput: data.admin_input_stats.reduce((sum, admin) => sum + admin.total_input, 0),
    topPerformer: data.admin_input_stats[0] // Sudah diurutkan descending
  }
};
```

### 5. Age Distribution Chart
```javascript
const ageChartData = Object.entries(data.insight.age_distribution).map(([age, count]) => ({
  label: age,
  value: count
}));
```

### 6. Growth Chart
```javascript
const growthChartData = data.growth.map(item => ({
  period: item.period,
  count: item.count
}));
```

## 🔧 Implementasi Frontend

### 1. Fetch Dashboard Data
```javascript
async function fetchDashboardData(period = 'all') {
  try {
    const response = await fetch(`/api/dashboard/stats?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    throw error;
  }
}
```

### 2. Display Normalized Data
```javascript
function displayNormalizedData(data) {
  // Tampilkan keluhan yang sudah dinormalisasi
  const keluhanElement = document.getElementById('top-keluhan');
  keluhanElement.innerHTML = data.normalized_data.keluhan.formatted;
  
  // Tampilkan sumber informasi yang sudah dinormalisasi
  const sumberElement = document.getElementById('sumber-informasi');
  sumberElement.innerHTML = data.normalized_data.sumber_informasi.formatted;
}
```

### 3. Display Admin Stats
```javascript
function displayAdminStats(data) {
  if (!data.admin_input_stats) return;
  
  const adminStatsContainer = document.getElementById('admin-stats');
  adminStatsContainer.innerHTML = data.admin_input_stats.map(admin => `
    <div class="admin-stat-card">
      <h4>${admin.admin_name}</h4>
      <p>Total Input: ${admin.total_input}</p>
      <div class="detail-breakdown">
        <span>Anak: ${admin.detail.anak}</span>
        <span>Penilaian: ${admin.detail.penilaian}</span>
        <span>Program: ${admin.detail.program_terapi}</span>
      </div>
    </div>
  `).join('');
}
```

### 4. Role-based Display
```javascript
function displayRoleBasedData(data, userRole) {
  // Tampilkan data berdasarkan role
  if (['SUPERADMIN', 'MANAJER'].includes(userRole)) {
    displayAdminStats(data);
    displayNormalizedData(data);
  } else if (userRole === 'ADMIN') {
    displayNormalizedData(data);
  }
  
  // Tampilkan data dasar untuk semua role
  displaySummaryCards(data);
  displayGrowthChart(data);
}
```

## 🎨 UI/UX Recommendations

### 1. Summary Cards Layout
```css
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-left: 4px solid var(--card-color);
}
```

### 2. Normalized Data Display
```css
.normalized-data {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.normalized-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}
```

### 3. Admin Stats Grid
```css
.admin-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.admin-stat-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

## 📈 Charts & Visualizations

### 1. Age Distribution Pie Chart
```javascript
const ageChartConfig = {
  type: 'pie',
  data: {
    labels: Object.keys(data.insight.age_distribution),
    datasets: [{
      data: Object.values(data.insight.age_distribution),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  }
};
```

### 2. Growth Line Chart
```javascript
const growthChartConfig = {
  type: 'line',
  data: {
    labels: data.growth.map(item => item.period),
    datasets: [{
      label: 'Pertumbuhan Anak',
      data: data.growth.map(item => item.count),
      borderColor: '#36A2EB',
      fill: false
    }]
  }
};
```

### 3. Admin Input Bar Chart
```javascript
const adminChartConfig = {
  type: 'bar',
  data: {
    labels: data.admin_input_stats.map(admin => admin.admin_name),
    datasets: [{
      label: 'Total Input',
      data: data.admin_input_stats.map(admin => admin.total_input),
      backgroundColor: '#36A2EB'
    }]
  }
};
```

## 🔄 Real-time Updates

### 1. Auto Refresh
```javascript
// Refresh dashboard setiap 5 menit
setInterval(() => {
  fetchDashboardData().then(updateDashboard);
}, 5 * 60 * 1000);
```

### 2. Period Filter
```javascript
function changePeriod(period) {
  fetchDashboardData(period).then(updateDashboard);
}

// Event listeners untuk filter
document.getElementById('period-filter').addEventListener('change', (e) => {
  changePeriod(e.target.value);
});
```

## 🚨 Error Handling

### 1. Network Errors
```javascript
function handleDashboardError(error) {
  console.error('Dashboard error:', error);
  
  // Tampilkan pesan error user-friendly
  const errorMessage = document.getElementById('error-message');
  errorMessage.innerHTML = `
    <div class="alert alert-danger">
      <strong>Error:</strong> Gagal memuat data dashboard. 
      Silakan coba lagi dalam beberapa saat.
    </div>
  `;
}
```

### 2. Data Validation
```javascript
function validateDashboardData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid dashboard data');
  }
  
  // Validasi data yang diperlukan
  const requiredFields = ['total_anak', 'anak_aktif', 'insight'];
  requiredFields.forEach(field => {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`);
    }
  });
}
```

## 📱 Mobile Responsiveness

### 1. Responsive Grid
```css
@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .admin-stats-grid {
    grid-template-columns: 1fr;
  }
}
```

### 2. Touch-friendly Charts
```javascript
const mobileChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
};
```

## 🔧 Performance Optimization

### 1. Lazy Loading
```javascript
// Load charts hanya ketika visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadChart(entry.target);
    }
  });
});
```

### 2. Data Caching
```javascript
const dashboardCache = new Map();

function getCachedData(period) {
  const cacheKey = `dashboard-${period}`;
  const cached = dashboardCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }
  
  return null;
}
```

## 📋 Checklist Frontend Implementation

### ✅ Core Features
- [ ] Fetch dashboard data dengan authentication
- [ ] Display summary cards
- [ ] Display normalized keluhan data
- [ ] Display normalized sumber data
- [ ] Display admin input stats (role-based)
- [ ] Display age distribution chart
- [ ] Display growth chart

### ✅ UI/UX
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Role-based display
- [ ] Period filter
- [ ] Auto refresh

### ✅ Performance
- [ ] Data caching
- [ ] Lazy loading
- [ ] Optimized charts
- [ ] Mobile optimization

### ✅ Testing
- [ ] Unit tests untuk data processing
- [ ] Integration tests untuk API calls
- [ ] UI tests untuk responsive design
- [ ] Role-based access tests

## 🎯 Next Steps

### 1. Immediate (Week 1)
- Implementasi basic dashboard layout
- Display summary cards dan normalized data
- Role-based access control

### 2. Short-term (Week 2-3)
- Implementasi charts dan visualizations
- Mobile responsiveness
- Error handling dan loading states

### 3. Medium-term (Month 2)
- Performance optimization
- Advanced filtering
- Export functionality

### 4. Long-term (Month 3+)
- Real-time updates
- Advanced analytics
- Custom dashboards per role

## 📞 Support

Untuk pertanyaan atau bantuan implementasi, silakan hubungi:
- **Backend Team**: Untuk API issues
- **Frontend Team**: Untuk UI/UX implementation
- **QA Team**: Untuk testing dan validation 