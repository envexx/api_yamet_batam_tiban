# Fitur Assessment Otomatis

## Deskripsi
Fitur ini memastikan setiap anak yang ditambahkan atau diupdate melalui form akan otomatis memiliki record assessment di database. Hal ini memudahkan untuk menampilkan data assessment tanpa perlu membuat assessment secara manual.

---

## Implementasi

### 1. **Saat Create Anak Baru (POST /api/anak)**

Ketika anak baru ditambahkan melalui form, sistem akan otomatis membuat assessment default:

```javascript
// Assessment Default - Otomatis buat assessment awal
await tryRelasi('assessment_default', async () => {
  const assessmentDate = validatedData.tanggal_pemeriksaan ? 
    new Date(validatedData.tanggal_pemeriksaan) : 
    new Date();
  
  await prisma.penilaianAnak.create({
    data: {
      anak_id: anak.id,
      assessment_date: assessmentDate,
      assessment_type: 'Assessment Awal',
      assessment_result: 'Menunggu Penilaian',
      notes: `Assessment otomatis dibuat saat pendaftaran anak ${anak.full_name}`,
      created_by: user.id,
    },
  });
});
```

### 2. **Saat Update Anak (PUT /api/anak/{id})**

Ketika data anak diupdate, sistem akan mengecek apakah sudah ada assessment. Jika belum ada, akan dibuat assessment default:

```javascript
// Cek apakah anak sudah punya assessment, jika belum buat assessment default
const existingAssessment = await tx.penilaianAnak.findFirst({
  where: { anak_id: anakId }
});

if (!existingAssessment) {
  const assessmentDate = validatedData.tanggal_pemeriksaan ? 
    new Date(validatedData.tanggal_pemeriksaan) : 
    new Date();
  
  await tx.penilaianAnak.create({
    data: {
      anak_id: anakId,
      assessment_date: assessmentDate,
      assessment_type: 'Assessment Awal',
      assessment_result: 'Menunggu Penilaian',
      notes: `Assessment otomatis dibuat saat update data anak ${anak.full_name}`,
      created_by: user.id,
    },
  });
}
```

---

## Data Assessment Default

### **Field yang Diisi Otomatis:**

| Field | Value | Keterangan |
|-------|-------|------------|
| `anak_id` | ID anak yang baru dibuat/diupdate | Relasi ke tabel anak |
| `assessment_date` | `tanggal_pemeriksaan` atau `new Date()` | Tanggal assessment |
| `assessment_type` | `'Assessment Awal'` | Jenis assessment default |
| `assessment_result` | `'Menunggu Penilaian'` | Status default |
| `notes` | `'Assessment otomatis dibuat saat...'` | Catatan otomatis |
| `created_by` | ID user yang membuat anak | Tracking user |

---

## Response yang Diperbarui

### **Create Anak Response:**
```json
{
  "status": "success",
  "message": "Data anak berhasil dibuat (asynchronous, non-transaction)",
  "data": {
    "anak": {
      "id": 1,
      "full_name": "Budi",
      // ... data anak lainnya
      "penilaian": [
        {
          "id": 1,
          "anak_id": 1,
          "assessment_date": "2024-06-01T00:00:00.000Z",
          "assessment_type": "Assessment Awal",
          "assessment_result": "Menunggu Penilaian",
          "notes": "Assessment otomatis dibuat saat pendaftaran anak Budi",
          "created_by": 2,
          "created_at": "2024-06-01T00:00:00.000Z",
          "user_created": {
            "id": 2,
            "name": "Admin"
          }
        }
      ]
    }
  },
  "relasi_summary": [
    {
      "relasi": "assessment_default",
      "status": "success"
    }
    // ... relasi lainnya
  ]
}
```

### **Update Anak Response:**
```json
{
  "status": "success",
  "message": "Data anak berhasil diperbarui",
  "data": {
    "anak": {
      "id": 1,
      "full_name": "Budi",
      // ... data anak lainnya
      "penilaian": [
        {
          "id": 1,
          "anak_id": 1,
          "assessment_date": "2024-06-01T00:00:00.000Z",
          "assessment_type": "Assessment Awal",
          "assessment_result": "Menunggu Penilaian",
          "notes": "Assessment otomatis dibuat saat update data anak Budi",
          "created_by": 2,
          "created_at": "2024-06-01T00:00:00.000Z",
          "user_created": {
            "id": 2,
            "name": "Admin"
          }
        }
      ]
    }
  }
}
```

---

## Keuntungan

### **1. Data Consistency**
- Setiap anak pasti memiliki minimal 1 assessment
- Tidak ada anak tanpa data assessment

### **2. Frontend Integration**
- Frontend bisa langsung menampilkan data assessment
- Tidak perlu cek apakah assessment ada atau tidak

### **3. User Experience**
- User tidak perlu membuat assessment manual
- Assessment bisa langsung diupdate dengan data real

### **4. Analytics & Reporting**
- Dashboard stats bisa menghitung assessment dengan akurat
- Conversion rate assessment ke program terapi lebih reliable

---

## Cara Kerja

### **Flow Create Anak:**
1. User submit form add anak
2. Backend create data anak utama
3. Backend create semua relasi (survey, orang tua, dll)
4. **Backend otomatis create assessment default**
5. Return response dengan data anak + assessment

### **Flow Update Anak:**
1. User submit form update anak
2. Backend update data anak
3. Backend update relasi yang diubah
4. **Backend cek apakah ada assessment**
5. **Jika tidak ada, buat assessment default**
6. Return response dengan data anak + assessment

---

## Error Handling

### **Assessment Creation Error:**
Jika pembuatan assessment gagal, error akan ditangkap dalam `tryRelasi`:

```json
{
  "status": "partial_success",
  "message": "Data anak utama berhasil dibuat, namun ada beberapa relasi yang gagal",
  "relasi_summary": [
    {
      "relasi": "assessment_default",
      "status": "failed",
      "error": "Database connection error"
    }
  ]
}
```

### **Transaction Safety:**
- Create anak: Assessment dibuat secara async (tidak dalam transaction)
- Update anak: Assessment dibuat dalam transaction (rollback jika gagal)

---

## Testing

### **Test Create Anak:**
```bash
POST /api/anak
{
  "full_name": "Test Anak",
  "tanggal_pemeriksaan": "2024-06-01"
}
```

**Expected Result:** Anak dibuat + assessment default dibuat

### **Test Update Anak (tanpa assessment):**
```bash
PUT /api/anak/1
{
  "full_name": "Test Anak Updated"
}
```

**Expected Result:** Anak diupdate + assessment default dibuat (jika belum ada)

### **Test Update Anak (dengan assessment):**
```bash
PUT /api/anak/1
{
  "full_name": "Test Anak Updated"
}
```

**Expected Result:** Anak diupdate + assessment tidak dibuat (sudah ada)

---

## Migration untuk Data Existing

Jika ada data anak yang sudah ada tapi belum punya assessment, bisa dibuat script migration:

```sql
-- Buat assessment default untuk anak yang belum punya assessment
INSERT INTO penilaian_anak (anak_id, assessment_date, assessment_type, assessment_result, notes, created_by, created_at)
SELECT 
  a.id,
  COALESCE(a.tanggal_pemeriksaan, a.created_at),
  'Assessment Awal',
  'Menunggu Penilaian',
  CONCAT('Assessment otomatis dibuat untuk anak ', a.full_name),
  COALESCE(a.created_by, 1),
  NOW()
FROM anak a
LEFT JOIN penilaian_anak pa ON a.id = pa.anak_id
WHERE pa.id IS NULL AND a.deleted_at IS NULL;
```

---

## Catatan Penting

1. **Assessment dibuat secara otomatis** - User tidak perlu action manual
2. **Data assessment bisa diupdate** - Assessment default bisa diubah menjadi data real
3. **Tidak ada duplicate** - Sistem cek dulu sebelum buat assessment baru
4. **Audit trail lengkap** - Semua assessment tercatat siapa yang membuat
5. **Flexible date** - Assessment date menggunakan tanggal pemeriksaan atau tanggal sekarang

---

# Assessment Endpoints untuk Frontend

Berikut adalah semua endpoint assessment yang dapat diakses oleh frontend:

## 1. **Global Assessment List (Grouped by Anak)**

### Endpoint
```
GET /api/assessment
```

### Deskripsi
Mengambil daftar assessment yang dikelompokkan berdasarkan anak. Hanya untuk ADMIN dan SUPERADMIN.

### Query Parameters
| Name     | Type   | Description                        | Default |
|----------|--------|------------------------------------|---------|
| page     | int    | Page number                        | 1       |
| limit    | int    | Items per page                     | 10      |
| search   | string | Search by nama anak, tipe, hasil, notes | ""      |
| sortBy   | string | Sort field                         | created_at |
| sortOrder| string | asc/desc                           | DESC    |

### Authorization
- **Required**: Bearer token (JWT)
- **Role**: SUPERADMIN, ADMIN

### Response
```json
{
  "status": "success",
  "message": "Assessment grouped by anak fetched",
  "data": [
    {
      "id": 1,
      "full_name": "Budi",
      "penilaian": [
        {
          "id": 1,
          "anak_id": 1,
          "assessment_date": "2024-06-01T00:00:00.000Z",
          "assessment_type": "Assessment Awal",
          "assessment_result": "Menunggu Penilaian",
          "notes": "Assessment otomatis dibuat...",
          "created_by": 2,
          "created_at": "2024-06-01T00:00:00.000Z",
          "user_created": {
            "id": 2,
            "name": "Admin"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Frontend Example
```javascript
// Get all assessments grouped by anak
const response = await fetch('/api/assessment?page=1&limit=10&search=budi', {
  headers: { Authorization: 'Bearer ' + token }
});
const data = await response.json();
```

---

## 2. **Assessment per Anak**

### 2.1 List Assessment Anak
```
GET /api/anak/{id}/assessment
```

#### Query Parameters
| Name     | Type   | Description                        | Default |
|----------|--------|------------------------------------|---------|
| page     | int    | Page number                        | 1       |
| limit    | int    | Items per page                     | 10      |
| sortBy   | string | Sort field                         | assessment_date |
| sortOrder| string | asc/desc                           | desc    |

#### Response
```json
{
  "status": "success",
  "message": "Assessment list fetched",
  "data": [
    {
      "id": 1,
      "anak_id": 1,
      "assessment_date": "2024-06-01T00:00:00.000Z",
      "assessment_type": "Assessment Awal",
      "assessment_result": "Menunggu Penilaian",
      "notes": "Assessment otomatis dibuat...",
      "created_by": 2,
      "created_at": "2024-06-01T00:00:00.000Z",
      "user_created": {
        "id": 2,
        "name": "Admin"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### 2.2 Create Assessment Anak
```
POST /api/anak/{id}/assessment
```

#### Body (JSON)
```json
{
  "assessment_date": "2024-06-01",
  "assessment_type": "Kognitif",
  "assessment_result": "Baik",
  "notes": "Catatan assessment..."
}
```

#### Response
```json
{
  "status": "success",
  "message": "Assessment created",
  "data": {
    "assessment": {
      "id": 2,
      "anak_id": 1,
      "assessment_date": "2024-06-01T00:00:00.000Z",
      "assessment_type": "Kognitif",
      "assessment_result": "Baik",
      "notes": "Catatan assessment...",
      "created_by": 2,
      "created_at": "2024-06-01T00:00:00.000Z",
      "user_created": {
        "id": 2,
        "name": "Admin"
      }
    }
  }
}
```

### 2.3 Update Assessment Anak
```
PUT /api/anak/{id}/assessment?assessmentId={assessmentId}
```

#### Body (JSON)
```json
{
  "assessment_date": "2024-06-01",
  "assessment_type": "Kognitif",
  "assessment_result": "Sangat Baik",
  "notes": "Catatan assessment updated..."
}
```

#### Response
```json
{
  "status": "success",
  "message": "Assessment updated",
  "data": {
    "assessment": {
      "id": 2,
      "anak_id": 1,
      "assessment_date": "2024-06-01T00:00:00.000Z",
      "assessment_type": "Kognitif",
      "assessment_result": "Sangat Baik",
      "notes": "Catatan assessment updated...",
      "created_by": 2,
      "created_at": "2024-06-01T00:00:00.000Z",
      "user_created": {
        "id": 2,
        "name": "Admin"
      }
    }
  }
}
```

### 2.4 Delete Assessment Anak
```
DELETE /api/anak/{id}/assessment?assessmentId={assessmentId}
```

#### Response
```json
{
  "status": "success",
  "message": "Assessment deleted"
}
```

---

## 3. **Assessment dalam Data Anak**

### Endpoint
```
GET /api/anak/{id}
```

### Deskripsi
Mengambil data anak lengkap termasuk assessment terbaru (5 assessment terakhir).

### Response (Include Assessment)
```json
{
  "status": "success",
  "message": "Data anak berhasil diambil",
  "data": {
    "anak": {
      "id": 1,
      "full_name": "Budi",
      // ... data anak lainnya
      "penilaian": [
        {
          "id": 1,
          "anak_id": 1,
          "assessment_date": "2024-06-01T00:00:00.000Z",
          "assessment_type": "Assessment Awal",
          "assessment_result": "Menunggu Penilaian",
          "notes": "Assessment otomatis dibuat...",
          "created_by": 2,
          "created_at": "2024-06-01T00:00:00.000Z"
        }
      ]
    }
  }
}
```

---

## 4. **Authorization & Permissions**

### Role-based Access
| Endpoint | SUPERADMIN | ADMIN | TERAPIS |
|----------|------------|-------|---------|
| `GET /api/assessment` | ✅ | ✅ | ❌ |
| `GET /api/anak/{id}/assessment` | ✅ | ✅ | ✅ |
| `POST /api/anak/{id}/assessment` | ✅ | ✅ | ❌ |
| `PUT /api/anak/{id}/assessment` | ✅ | ✅ | ❌ |
| `DELETE /api/anak/{id}/assessment` | ✅ | ✅ | ❌ |

### Notes
- **TERAPIS** hanya bisa melihat assessment, tidak bisa create/update/delete
- **ADMIN & SUPERADMIN** memiliki akses penuh ke semua operasi assessment
- Semua endpoint membutuhkan Bearer token (JWT)

---

## 5. **Frontend Integration Examples**

### React Hook Example
```javascript
// Custom hook untuk assessment
const useAssessment = (anakId) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/anak/${anakId}/assessment`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setAssessments(data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createAssessment = async (assessmentData) => {
    try {
      const response = await fetch(`/api/anak/${anakId}/assessment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token 
        },
        body: JSON.stringify(assessmentData)
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchAssessments(); // Refresh list
      }
      return data;
    } catch (err) {
      setError(err.message);
    }
  };

  return { assessments, loading, error, fetchAssessments, createAssessment };
};
```

### Vue.js Example
```javascript
// Composition API untuk assessment
export function useAssessment(anakId) {
  const assessments = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchAssessments = async () => {
    loading.value = true;
    try {
      const response = await fetch(`/api/anak/${anakId}/assessment`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      if (data.status === 'success') {
        assessments.value = data.data;
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { assessments, loading, error, fetchAssessments };
}
```

---

## 6. **Error Handling**

### Common Error Responses
```json
// Unauthorized
{
  "status": "error",
  "message": "Akses ditolak. Token tidak valid."
}

// Forbidden
{
  "status": "error", 
  "message": "Akses ditolak."
}

// Validation Error
{
  "status": "error",
  "message": "Data tidak valid",
  "errors": [
    {
      "path": ["assessment_date"],
      "message": "Invalid date format"
    }
  ]
}

// Not Found
{
  "status": "error",
  "message": "Assessment tidak ditemukan"
}
```

---

## 7. **Validation Schema**

### Assessment Data Validation
```javascript
const assessmentSchema = z.object({
  assessment_date: z.string(), // Required
  assessment_type: z.string(), // Required
  assessment_result: z.string().optional(),
  notes: z.string().optional(),
});
```

### Required Fields
- `assessment_date`: Tanggal assessment (format: YYYY-MM-DD)
- `assessment_type`: Jenis assessment (string)

### Optional Fields
- `assessment_result`: Hasil assessment
- `notes`: Catatan tambahan

---

## 8. **Best Practices**

### Frontend
1. **Always check authorization** - Pastikan user punya permission
2. **Handle loading states** - Tampilkan loading saat fetch data
3. **Error handling** - Tangani semua error response
4. **Optimistic updates** - Update UI sebelum API response
5. **Refresh data** - Refresh list setelah create/update/delete

### Backend
1. **Input validation** - Validasi semua input dengan Zod
2. **Authorization check** - Cek role user di setiap endpoint
3. **Error handling** - Tangani semua error dengan proper response
4. **Audit trail** - Catat siapa yang create/update/delete
5. **Pagination** - Implement pagination untuk list data 