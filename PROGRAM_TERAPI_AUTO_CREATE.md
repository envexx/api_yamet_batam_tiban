# Fitur Program Terapi Otomatis

## Deskripsi
Fitur ini memastikan setiap anak yang ditambahkan atau diupdate melalui form akan otomatis memiliki record program terapi di database. Hal ini memudahkan untuk menampilkan data program terapi tanpa perlu membuat program secara manual.

---

## Implementasi

### 1. **Saat Create Anak Baru (POST /api/anak)**

Ketika anak baru ditambahkan melalui form, sistem akan otomatis membuat program terapi default:

```javascript
// Program Terapi Default - Otomatis buat program terapi awal
await tryRelasi('program_terapi_default', async () => {
  const programStartDate = validatedData.tanggal_pemeriksaan ? 
    new Date(validatedData.tanggal_pemeriksaan) : 
    new Date();
  
  // Buat program terapi default berdasarkan nama anak
  const defaultProgramName = `Program Terapi - ${anak.full_name}`;
  
  await prisma.programTerapi.create({
    data: {
      anak_id: anak.id,
      program_name: defaultProgramName,
      description: `Program terapi otomatis dibuat saat pendaftaran anak ${anak.full_name}`,
      start_date: programStartDate,
      end_date: new Date(programStartDate.getTime() + (90 * 24 * 60 * 60 * 1000)), // 90 hari dari start
      status: 'AKTIF',
      created_by: user.id,
    },
  });
});
```

### 2. **Saat Update Anak (PUT /api/anak/{id})**

Ketika data anak diupdate, sistem akan mengecek apakah sudah ada program terapi. Jika belum ada, akan dibuat program terapi default:

```javascript
// Cek apakah anak sudah punya program terapi, jika belum buat program terapi default
const existingProgram = await tx.programTerapi.findFirst({
  where: { anak_id: anakId }
});

if (!existingProgram) {
  const programStartDate = validatedData.tanggal_pemeriksaan ? 
    new Date(validatedData.tanggal_pemeriksaan) : 
    new Date();
  
  await tx.programTerapi.create({
    data: {
      anak_id: anakId,
      program_name: `Program Terapi - ${anak.full_name}`,
      description: `Program terapi otomatis dibuat saat update data anak ${anak.full_name}`,
      start_date: programStartDate,
      end_date: new Date(programStartDate.getTime() + (90 * 24 * 60 * 60 * 1000)), // 90 hari dari start
      status: 'AKTIF',
      created_by: user.id,
    },
  });
}
```

---

## Data Program Terapi Default

### **Field yang Diisi Otomatis:**

| Field | Value | Keterangan |
|-------|-------|------------|
| `anak_id` | ID anak yang baru dibuat/diupdate | Relasi ke tabel anak |
| `program_name` | `'Program Terapi - {nama_anak}'` | Nama program default |
| `description` | `'Program terapi otomatis dibuat saat...'` | Deskripsi otomatis |
| `start_date` | `tanggal_pemeriksaan` atau `new Date()` | Tanggal mulai program |
| `end_date` | `start_date + 90 hari` | Tanggal selesai (3 bulan) |
| `status` | `'AKTIF'` | Status default |
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
      "program_terapi": [
        {
          "id": 1,
          "anak_id": 1,
          "program_name": "Program Terapi - Budi",
          "description": "Program terapi otomatis dibuat saat pendaftaran anak Budi",
          "start_date": "2024-06-01T00:00:00.000Z",
          "end_date": "2024-08-30T00:00:00.000Z",
          "status": "AKTIF",
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
      "relasi": "program_terapi_default",
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
      "program_terapi": [
        {
          "id": 1,
          "anak_id": 1,
          "program_name": "Program Terapi - Budi",
          "description": "Program terapi otomatis dibuat saat update data anak Budi",
          "start_date": "2024-06-01T00:00:00.000Z",
          "end_date": "2024-08-30T00:00:00.000Z",
          "status": "AKTIF",
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
- Setiap anak pasti memiliki minimal 1 program terapi
- Tidak ada anak tanpa data program terapi

### **2. Frontend Integration**
- Frontend bisa langsung menampilkan data program terapi
- Tidak perlu cek apakah program terapi ada atau tidak

### **3. User Experience**
- User tidak perlu membuat program terapi manual
- Program terapi bisa langsung diupdate dengan data real

### **4. Analytics & Reporting**
- Dashboard stats bisa menghitung program terapi dengan akurat
- Conversion rate assessment ke program terapi lebih reliable

---

## Cara Kerja

### **Flow Create Anak:**
1. User submit form add anak
2. Backend create data anak utama
3. Backend create semua relasi (survey, orang tua, dll)
4. **Backend otomatis create assessment default**
5. **Backend otomatis create program terapi default**
6. Return response dengan data anak + assessment + program terapi

### **Flow Update Anak:**
1. User submit form update anak
2. Backend update data anak
3. Backend update relasi yang diubah
4. **Backend cek apakah ada assessment**
5. **Jika tidak ada, buat assessment default**
6. **Backend cek apakah ada program terapi**
7. **Jika tidak ada, buat program terapi default**
8. Return response dengan data anak + assessment + program terapi

---

## Error Handling

### **Program Terapi Creation Error:**
Jika pembuatan program terapi gagal, error akan ditangkap dalam `tryRelasi`:

```json
{
  "status": "partial_success",
  "message": "Data anak utama berhasil dibuat, namun ada beberapa relasi yang gagal",
  "relasi_summary": [
    {
      "relasi": "program_terapi_default",
      "status": "failed",
      "error": "Database connection error"
    }
  ]
}
```

### **Transaction Safety:**
- Create anak: Program terapi dibuat secara async (tidak dalam transaction)
- Update anak: Program terapi dibuat dalam transaction (rollback jika gagal)

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

**Expected Result:** Anak dibuat + assessment default dibuat + program terapi default dibuat

### **Test Update Anak (tanpa program terapi):**
```bash
PUT /api/anak/1
{
  "full_name": "Test Anak Updated"
}
```

**Expected Result:** Anak diupdate + program terapi default dibuat (jika belum ada)

### **Test Update Anak (dengan program terapi):**
```bash
PUT /api/anak/1
{
  "full_name": "Test Anak Updated"
}
```

**Expected Result:** Anak diupdate + program terapi tidak dibuat (sudah ada)

---

## Migration untuk Data Existing

Jika ada data anak yang sudah ada tapi belum punya program terapi, bisa dibuat script migration:

```sql
-- Buat program terapi default untuk anak yang belum punya program terapi
INSERT INTO program_terapi (anak_id, program_name, description, start_date, end_date, status, created_by, created_at)
SELECT 
  a.id,
  CONCAT('Program Terapi - ', a.full_name),
  CONCAT('Program terapi otomatis dibuat untuk anak ', a.full_name),
  COALESCE(a.tanggal_pemeriksaan, a.created_at),
  COALESCE(a.tanggal_pemeriksaan, a.created_at) + INTERVAL '90 days',
  'AKTIF',
  COALESCE(a.created_by, 1),
  NOW()
FROM anak a
LEFT JOIN program_terapi pt ON a.id = pt.anak_id
WHERE pt.id IS NULL AND a.deleted_at IS NULL;
```

---

## Perbedaan dengan Assessment Auto-Create

### **Assessment:**
- **Jenis:** Assessment awal untuk evaluasi
- **Durasi:** Tidak ada durasi (one-time assessment)
- **Status:** "Menunggu Penilaian"

### **Program Terapi:**
- **Jenis:** Program terapi untuk treatment
- **Durasi:** 90 hari (3 bulan) default
- **Status:** "AKTIF"

---

## Catatan Penting

1. **Program terapi dibuat secara otomatis** - User tidak perlu action manual
2. **Data program terapi bisa diupdate** - Program terapi default bisa diubah menjadi data real
3. **Tidak ada duplicate** - Sistem cek dulu sebelum buat program terapi baru
4. **Audit trail lengkap** - Semua program terapi tercatat siapa yang membuat
5. **Flexible date** - Program terapi date menggunakan tanggal pemeriksaan atau tanggal sekarang
6. **Durasi default 90 hari** - Program terapi dibuat dengan durasi 3 bulan default

---

# Program Terapi Endpoints untuk Frontend

Berikut adalah semua endpoint program terapi yang dapat diakses oleh frontend. Program terapi ditampilkan dalam 1 card utuh karena setiap anak bisa memiliki banyak program terapi (contoh: TW 1 jam, BT 1 jam, dll).

---

## 1. **Global Program Terapi List (Grouped by Anak)**

### Endpoint
```
GET /api/program-terapi
```

### Deskripsi
Mengambil daftar program terapi yang dikelompokkan berdasarkan anak. Hanya untuk ADMIN dan SUPERADMIN.

### Query Parameters
| Name     | Type   | Description                        | Default |
|----------|--------|------------------------------------|---------|
| page     | int    | Page number                        | 1       |
| limit    | int    | Items per page                     | 10      |
| search   | string | Search by nama anak                | ""      |
| anakId   | int    | Filter by specific anak ID         | null    |
| sortBy   | string | Sort field                         | id      |
| sortOrder| string | asc/desc                           | DESC    |

### Authorization
- **Required**: Bearer token (JWT)
- **Role**: SUPERADMIN, ADMIN

### Response
```json
{
  "status": "success",
  "message": "Program terapi grouped by anak fetched",
  "data": [
    {
      "id": 1,
      "full_name": "Budi",
      "program_terapi": [
        {
          "id": 1,
          "anak_id": 1,
          "program_name": "Terapi Wicara",
          "description": "Terapi untuk meningkatkan kemampuan bicara",
          "start_date": "2024-06-01T00:00:00.000Z",
          "end_date": "2024-07-01T00:00:00.000Z",
          "status": "AKTIF",
          "created_by": 2,
          "created_at": "2024-06-01T00:00:00.000Z",
          "user_created": {
            "id": 2,
            "name": "Admin"
          }
        },
        {
          "id": 2,
          "anak_id": 1,
          "program_name": "Terapi Perilaku",
          "description": "Terapi untuk mengatasi masalah perilaku",
          "start_date": "2024-06-01T00:00:00.000Z",
          "end_date": "2024-07-01T00:00:00.000Z",
          "status": "AKTIF",
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
// Get all program terapi grouped by anak
const response = await fetch('/api/program-terapi?page=1&limit=10&search=budi', {
  headers: { Authorization: 'Bearer ' + token }
});
const data = await response.json();

// Filter by specific anak
const response = await fetch('/api/program-terapi?anakId=1', {
  headers: { Authorization: 'Bearer ' + token }
});
const data = await response.json();
```

---

## 2. **Program Terapi per Anak**

### 2.1 List Program Terapi Anak
```
GET /api/anak/{id}/program-terapi
```

#### Query Parameters
| Name     | Type   | Description                        | Default |
|----------|--------|------------------------------------|---------|
| page     | int    | Page number                        | 1       |
| limit    | int    | Items per page                     | 10      |
| sortBy   | string | Sort field                         | created_at |
| sortOrder| string | asc/desc                           | desc    |

#### Response
```json
{
  "status": "success",
  "message": "Program list fetched",
  "data": [
    {
      "id": 1,
      "anak_id": 1,
      "program_name": "Terapi Wicara",
      "description": "Terapi untuk meningkatkan kemampuan bicara",
      "start_date": "2024-06-01T00:00:00.000Z",
      "end_date": "2024-07-01T00:00:00.000Z",
      "status": "AKTIF",
      "created_by": 2,
      "created_at": "2024-06-01T00:00:00.000Z",
      "user_created": {
        "id": 2,
        "name": "Admin"
      }
    },
    {
      "id": 2,
      "anak_id": 1,
      "program_name": "Terapi Perilaku",
      "description": "Terapi untuk mengatasi masalah perilaku",
      "start_date": "2024-06-01T00:00:00.000Z",
      "end_date": "2024-07-01T00:00:00.000Z",
      "status": "AKTIF",
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

### 2.2 Create Program Terapi Anak
```
POST /api/anak/{id}/program-terapi
```

#### Body (JSON)
```json
{
  "program_name": "Terapi Wicara",
  "description": "Terapi untuk meningkatkan kemampuan bicara",
  "start_date": "2024-06-01",
  "end_date": "2024-07-01",
  "status": "AKTIF"
}
```

#### Response
```json
{
  "status": "success",
  "message": "Program created",
  "data": {
    "program": {
      "id": 3,
      "anak_id": 1,
      "program_name": "Terapi Wicara",
      "description": "Terapi untuk meningkatkan kemampuan bicara",
      "start_date": "2024-06-01T00:00:00.000Z",
      "end_date": "2024-07-01T00:00:00.000Z",
      "status": "AKTIF",
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

### 2.3 Update Program Terapi Anak
```
PUT /api/anak/{id}/program-terapi?programId={programId}
```

#### Body (JSON)
```json
{
  "program_name": "Terapi Wicara Update",
  "description": "Terapi untuk meningkatkan kemampuan bicara dan bahasa",
  "start_date": "2024-06-10",
  "end_date": "2024-07-10",
  "status": "SELESAI"
}
```

#### Response
```json
{
  "status": "success",
  "message": "Program updated",
  "data": {
    "program": {
      "id": 3,
      "anak_id": 1,
      "program_name": "Terapi Wicara Update",
      "description": "Terapi untuk meningkatkan kemampuan bicara dan bahasa",
      "start_date": "2024-06-10T00:00:00.000Z",
      "end_date": "2024-07-10T00:00:00.000Z",
      "status": "SELESAI",
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

### 2.4 Delete Program Terapi Anak
```
DELETE /api/anak/{id}/program-terapi?programId={programId}
```

#### Response
```json
{
  "status": "success",
  "message": "Program deleted"
}
```

---

## 3. **Program Terapi dalam Data Anak**

### Endpoint
```
GET /api/anak/{id}
```

### Deskripsi
Mengambil data anak lengkap termasuk program terapi terbaru (5 program terapi terakhir).

### Response (Include Program Terapi)
```json
{
  "status": "success",
  "message": "Data anak berhasil diambil",
  "data": {
    "anak": {
      "id": 1,
      "full_name": "Budi",
      // ... data anak lainnya
      "program_terapi": [
        {
          "id": 1,
          "anak_id": 1,
          "program_name": "Terapi Wicara",
          "description": "Terapi untuk meningkatkan kemampuan bicara",
          "start_date": "2024-06-01T00:00:00.000Z",
          "end_date": "2024-07-01T00:00:00.000Z",
          "status": "AKTIF",
          "created_by": 2,
          "created_at": "2024-06-01T00:00:00.000Z"
        },
        {
          "id": 2,
          "anak_id": 1,
          "program_name": "Terapi Perilaku",
          "description": "Terapi untuk mengatasi masalah perilaku",
          "start_date": "2024-06-01T00:00:00.000Z",
          "end_date": "2024-07-01T00:00:00.000Z",
          "status": "AKTIF",
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
| `GET /api/program-terapi` | ✅ | ✅ | ❌ |
| `GET /api/anak/{id}/program-terapi` | ✅ | ✅ | ✅ |
| `POST /api/anak/{id}/program-terapi` | ✅ | ✅ | ❌ |
| `PUT /api/anak/{id}/program-terapi` | ✅ | ✅ | ❌ |
| `DELETE /api/anak/{id}/program-terapi` | ✅ | ✅ | ❌ |

### Notes
- **TERAPIS** hanya bisa melihat program terapi, tidak bisa create/update/delete
- **ADMIN & SUPERADMIN** memiliki akses penuh ke semua operasi program terapi
- Semua endpoint membutuhkan Bearer token (JWT)

---

## 5. **Frontend Integration Examples**

### React Hook Example
```javascript
// Custom hook untuk program terapi
const useProgramTerapi = (anakId) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/anak/${anakId}/program-terapi`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setPrograms(data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProgram = async (programData) => {
    try {
      const response = await fetch(`/api/anak/${anakId}/program-terapi`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token 
        },
        body: JSON.stringify(programData)
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchPrograms(); // Refresh list
      }
      return data;
    } catch (err) {
      setError(err.message);
    }
  };

  const updateProgram = async (programId, programData) => {
    try {
      const response = await fetch(`/api/anak/${anakId}/program-terapi?programId=${programId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token 
        },
        body: JSON.stringify(programData)
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchPrograms(); // Refresh list
      }
      return data;
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteProgram = async (programId) => {
    try {
      const response = await fetch(`/api/anak/${anakId}/program-terapi?programId=${programId}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchPrograms(); // Refresh list
      }
      return data;
    } catch (err) {
      setError(err.message);
    }
  };

  return { 
    programs, 
    loading, 
    error, 
    fetchPrograms, 
    createProgram, 
    updateProgram, 
    deleteProgram 
  };
};
```

### Vue.js Example
```javascript
// Composition API untuk program terapi
export function useProgramTerapi(anakId) {
  const programs = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchPrograms = async () => {
    loading.value = true;
    try {
      const response = await fetch(`/api/anak/${anakId}/program-terapi`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      if (data.status === 'success') {
        programs.value = data.data;
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createProgram = async (programData) => {
    try {
      const response = await fetch(`/api/anak/${anakId}/program-terapi`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token 
        },
        body: JSON.stringify(programData)
      });
      const data = await response.json();
      if (data.status === 'success') {
        await fetchPrograms(); // Refresh list
      }
      return data;
    } catch (err) {
      error.value = err.message;
    }
  };

  return { programs, loading, error, fetchPrograms, createProgram };
}
```

### React Component Example (Card Utuh)
```jsx
// Component untuk menampilkan program terapi dalam 1 card
const ProgramTerapiCard = ({ anakId }) => {
  const { programs, loading, error, fetchPrograms, createProgram } = useProgramTerapi(anakId);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, [anakId]);

  const handleCreateProgram = async (formData) => {
    await createProgram(formData);
    setShowForm(false);
  };

  if (loading) return <div>Loading program terapi...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="program-terapi-card">
      <div className="card-header">
        <h3>Program Terapi</h3>
        <button onClick={() => setShowForm(true)}>Tambah Program</button>
      </div>
      
      <div className="programs-list">
        {programs.length === 0 ? (
          <p>Belum ada program terapi</p>
        ) : (
          programs.map(program => (
            <div key={program.id} className="program-item">
              <div className="program-header">
                <h4>{program.program_name}</h4>
                <span className={`status ${program.status.toLowerCase()}`}>
                  {program.status}
                </span>
              </div>
              <p>{program.description}</p>
              <div className="program-dates">
                <span>Mulai: {new Date(program.start_date).toLocaleDateString()}</span>
                <span>Selesai: {new Date(program.end_date).toLocaleDateString()}</span>
              </div>
              <div className="program-meta">
                <small>Dibuat oleh: {program.user_created.name}</small>
                <small>Tanggal: {new Date(program.created_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <ProgramTerapiForm 
          onSubmit={handleCreateProgram}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};
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
      "path": ["program_name"],
      "message": "String must contain at least 2 character(s)"
    }
  ]
}

// Not Found
{
  "status": "error",
  "message": "Program tidak ditemukan"
}
```

---

## 7. **Validation Schema**

### Program Terapi Data Validation
```javascript
const programSchema = z.object({
  program_name: z.string().min(2), // Required
  description: z.string().optional(),
  start_date: z.string().optional(), // Format: YYYY-MM-DD
  end_date: z.string().optional(), // Format: YYYY-MM-DD
  status: z.enum(['AKTIF', 'SELESAI', 'DIBATALKAN']).default('AKTIF'),
});
```

### Required Fields
- `program_name`: Nama program terapi (min 2 karakter)

### Optional Fields
- `description`: Deskripsi program terapi
- `start_date`: Tanggal mulai (format: YYYY-MM-DD)
- `end_date`: Tanggal selesai (format: YYYY-MM-DD)
- `status`: Status program (AKTIF/SELESAI/DIBATALKAN, default: AKTIF)

---

## 8. **Best Practices**

### Frontend
1. **Display in single card** - Tampilkan semua program terapi dalam 1 card utuh
2. **Group by status** - Kelompokkan program berdasarkan status (AKTIF/SELESAI/DIBATALKAN)
3. **Show program details** - Tampilkan detail lengkap setiap program
4. **Handle multiple programs** - Siapkan UI untuk menampilkan banyak program per anak
5. **Real-time updates** - Refresh data setelah create/update/delete

### Backend
1. **Input validation** - Validasi semua input dengan Zod
2. **Authorization check** - Cek role user di setiap endpoint
3. **Error handling** - Tangani semua error dengan proper response
4. **Audit trail** - Catat siapa yang create/update/delete
5. **Pagination** - Implement pagination untuk list data

---

## 9. **Contoh Penggunaan Program Terapi**

### Skenario: Anak dengan Multiple Program
```json
{
  "anak_id": 1,
  "full_name": "Budi",
  "program_terapi": [
    {
      "id": 1,
      "program_name": "Terapi Wicara",
      "description": "Terapi untuk meningkatkan kemampuan bicara dan bahasa",
      "start_date": "2024-06-01T00:00:00.000Z",
      "end_date": "2024-07-01T00:00:00.000Z",
      "status": "AKTIF"
    },
    {
      "id": 2,
      "program_name": "Terapi Perilaku",
      "description": "Terapi untuk mengatasi masalah perilaku dan emosi",
      "start_date": "2024-06-01T00:00:00.000Z",
      "end_date": "2024-07-01T00:00:00.000Z",
      "status": "AKTIF"
    },
    {
      "id": 3,
      "program_name": "Terapi Okupasi",
      "description": "Terapi untuk meningkatkan kemampuan motorik halus",
      "start_date": "2024-06-15T00:00:00.000Z",
      "end_date": "2024-07-15T00:00:00.000Z",
      "status": "AKTIF"
    }
  ]
}
```

### Frontend Display Example
```jsx
// Tampilan dalam 1 card dengan multiple program
<div className="therapy-programs-card">
  <h3>Program Terapi - Budi</h3>
  
  <div className="programs-grid">
    {/* Program 1 */}
    <div className="program-item active">
      <h4>Terapi Wicara</h4>
      <p>Terapi untuk meningkatkan kemampuan bicara dan bahasa</p>
      <div className="program-status">AKTIF</div>
    </div>
    
    {/* Program 2 */}
    <div className="program-item active">
      <h4>Terapi Perilaku</h4>
      <p>Terapi untuk mengatasi masalah perilaku dan emosi</p>
      <div className="program-status">AKTIF</div>
    </div>
    
    {/* Program 3 */}
    <div className="program-item active">
      <h4>Terapi Okupasi</h4>
      <p>Terapi untuk meningkatkan kemampuan motorik halus</p>
      <div className="program-status">AKTIF</div>
    </div>
  </div>
</div>
```

---

## 10. **Perbedaan dengan Assessment**

### Assessment
- Setiap anak memiliki **multiple assessment records**
- Ditampilkan sebagai **list/table** terpisah
- Focus pada **tracking progress** dan **evaluation**

### Program Terapi
- Setiap anak memiliki **multiple program terapi**
- Ditampilkan dalam **1 card utuh** dengan multiple items
- Focus pada **active treatment plans** dan **therapy management**
- Lebih **visual** dan **comprehensive** dalam 1 view

### Kesamaan
- Keduanya menggunakan **CRUD operations** yang sama
- **Authorization** dan **permissions** yang sama
- **Validation** dan **error handling** yang sama
- **Pagination** dan **search** yang sama 