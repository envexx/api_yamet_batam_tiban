# API Documentation untuk Frontend Developer

## Overview
Dokumentasi ini menjelaskan API terbaru yang telah dibuat untuk sistem YAMET Batam Tiban, khususnya untuk tabel `conversion` dan `notifikasi`.

---

## 🔄 CONVERSION API

### Base URL
```
http://localhost:3001/api/conversion
```

### Authentication & Authorization
Semua endpoint memerlukan token JWT yang dikirim dalam header:
```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access Control
- **GET** - SUPERADMIN, ADMIN, MANAJER
- **POST** - SUPERADMIN, ADMIN  
- **PUT** - SUPERADMIN, ADMIN
- **DELETE** - SUPERADMIN

---

### 1. GET /api/conversion - Mengambil Data Conversion

**Endpoint:** `GET /api/conversion`

**Query Parameters:**
- `page` (optional): Halaman yang ingin diambil (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `search` (optional): Pencarian berdasarkan bulan
- `bulan` (optional): Filter berdasarkan bulan (format: "YYYY-MM")
- `tahun` (optional): Filter berdasarkan tahun

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "conversions": [
      {
        "id": 1,
        "jumlah_anak_keluar": 15,
        "jumlah_leads": 50,
        "jumlah_conversi": 12,
        "bulan": "January 2024",
        "tahun": 2024,
        "created_by": 1,
        "updated_by": 2,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-20T14:45:00Z",
        "user_created": {
          "id": 1,
          "name": "Admin User",
          "email": "admin@example.com"
        },
        "user_updated": {
          "id": 2,
          "name": "Manager User",
          "email": "manager@example.com"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_records": 50,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Token tidak valid"
}
```

**Contoh Implementasi Frontend:**
```javascript
// React Hook untuk mengambil data conversion
const useConversionData = (page = 1, limit = 10, search = '', bulan = '', tahun = '') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(bulan && { bulan }),
        ...(tahun && { tahun })
      });

      const response = await fetch(`/api/conversion?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search, bulan, tahun]);

  return { data, loading, error, refetch: fetchData };
};
```

---

### 2. POST /api/conversion - Membuat Data Conversion Baru

**Endpoint:** `POST /api/conversion`

**Request Body:**
```json
{
  "jumlah_anak_keluar": 15,
  "jumlah_leads": 50,
  "jumlah_conversi": 12,
  "bulan": "January 2024",
  "tahun": 2024
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Data conversion berhasil dibuat",
  "data": {
    "id": 1,
    "jumlah_anak_keluar": 15,
    "jumlah_leads": 50,
    "jumlah_conversi": 12,
    "bulan": "January 2024",
    "tahun": 2024,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Data untuk bulan dan tahun ini sudah ada"
}
```

**Contoh Implementasi Frontend:**
```javascript
// React Hook untuk membuat conversion
const useCreateConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createConversion = async (conversionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/conversion', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(conversionData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data atau update state
        return result.data;
      } else {
        setError(result.message);
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createConversion, loading, error };
};
```

---

### 3. PUT /api/conversion/[id] - Update Data Conversion

**Endpoint:** `PUT /api/conversion/[id]`

**Request Body:**
```json
{
  "jumlah_anak_keluar": 20,
  "jumlah_leads": 60,
  "jumlah_conversi": 18,
  "bulan": "January 2024",
  "tahun": 2024
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data conversion berhasil diupdate",
  "data": {
    "id": 1,
    "jumlah_anak_keluar": 20,
    "jumlah_leads": 60,
    "jumlah_conversi": 18,
    "bulan": "January 2024",
    "tahun": 2024,
    "created_by": 1,
    "updated_by": 2,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z"
  }
}
```

**Contoh Implementasi Frontend:**
```javascript
// React Hook untuk update conversion
const useUpdateConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateConversion = async (id, conversionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/conversion/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(conversionData)
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.message);
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateConversion, loading, error };
};
```

---

### 4. DELETE /api/conversion/[id] - Hapus Data Conversion

**Endpoint:** `DELETE /api/conversion/[id]`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data conversion berhasil dihapus"
}
```

**Contoh Implementasi Frontend:**
```javascript
// React Hook untuk delete conversion
const useDeleteConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteConversion = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/conversion/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteConversion, loading, error };
};
```

---

## 🔔 NOTIFIKASI API

### Base URL
```
http://localhost:3001/api/notifikasi
```

### Authentication & Authorization
Semua endpoint memerlukan token JWT yang dikirim dalam header:
```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access Control
- **GET** - SUPERADMIN (melihat semua notifikasi)
- **POST** - SUPERADMIN (membuat notifikasi)
- **PUT** - SUPERADMIN (mengupdate notifikasi)
- **DELETE** - SUPERADMIN (menghapus notifikasi)

### Notifikasi User
Endpoint `/api/notifikasi/user` dapat diakses oleh semua user yang terautentikasi untuk melihat notifikasi yang relevan dengan mereka.

---

### 1. GET /api/notifikasi - Mengambil Data Notifikasi (Superadmin)

**Endpoint:** `GET /api/notifikasi`

**Query Parameters:**
- `page` (optional): Halaman yang ingin diambil (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `search` (optional): Pencarian berdasarkan isi notifikasi
- `jenis_pemberitahuan` (optional): Filter berdasarkan jenis ("INFO", "WARNING", "SUCCESS", "ERROR")
- `tujuan` (optional): Filter berdasarkan tujuan
- `is_read` (optional): Filter berdasarkan status baca (true/false)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "notifikasis": [
      {
        "id": 1,
        "jenis_pemberitahuan": "INFO",
        "isi_notifikasi": "Sistem akan maintenance pada pukul 23:00 WIB",
        "tujuan": "ALL",
        "is_read": false,
        "created_by": 1,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z",
        "user_created": {
          "id": 1,
          "name": "Super Admin",
          "email": "superadmin@example.com"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_records": 25,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

### 2. POST /api/notifikasi - Membuat Notifikasi Baru (Superadmin)

**Endpoint:** `POST /api/notifikasi`

**Request Body:**
```json
{
  "jenis_pemberitahuan": "INFO",
  "isi_notifikasi": "Sistem akan maintenance pada pukul 23:00 WIB",
  "tujuan": "ALL"
}
```

**Tujuan Options:**
- `"ALL"` - Semua user
- `"ROLE:admin"` - Semua user dengan role admin
- `"ROLE:terapis"` - Semua user dengan role terapis
- `"USER:1,2,3"` - User dengan ID 1, 2, dan 3

**Jenis Pemberitahuan Options:**
- `"INFO"` - Informasi
- `"WARNING"` - Peringatan
- `"SUCCESS"` - Sukses
- `"ERROR"` - Error

---

### 3. GET /api/notifikasi/user - Mengambil Notifikasi User

**Endpoint:** `GET /api/notifikasi/user`

**Query Parameters:**
- `page` (optional): Halaman yang ingin diambil (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "notifikasis": [
      {
        "id": 1,
        "jenis_pemberitahuan": "INFO",
        "isi_notifikasi": "Sistem akan maintenance pada pukul 23:00 WIB",
        "tujuan": "ALL",
        "is_read": false,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_records": 15,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

### 4. PUT /api/notifikasi/user/[id] - Tandai Notifikasi sebagai Dibaca

**Endpoint:** `PUT /api/notifikasi/user/[id]`

**Request Body:**
```json
{
  "is_read": true
}
```

---

### 5. DELETE /api/notifikasi/[id] - Menghapus Notifikasi (Superadmin)

**Endpoint:** `DELETE /api/notifikasi/[id]`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data notifikasi berhasil dihapus"
}
```

---

### 6. PUT /api/notifikasi/[id] - Mengupdate Notifikasi (Superadmin)

**Endpoint:** `PUT /api/notifikasi/[id]`

**Request Body:**
```json
{
  "jenis_pemberitahuan": "INFO",
  "isi_notifikasi": "Sistem akan maintenance pada pukul 23:00 WIB",
  "tujuan": "ALL",
  "is_read": false
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data notifikasi berhasil diupdate",
  "data": {
    "id": 1,
    "jenis_pemberitahuan": "INFO",
    "isi_notifikasi": "Sistem akan maintenance pada pukul 23:00 WIB",
    "tujuan": "ALL",
    "is_read": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:30:00Z",
    "user_created": {
      "id": 1,
      "name": "Super Admin",
      "email": "superadmin@example.com"
    }
  }
}
```

---

### 7. GET /api/notifikasi/[id] - Mengambil Detail Notifikasi (Superadmin)

**Endpoint:** `GET /api/notifikasi/[id]`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "jenis_pemberitahuan": "INFO",
    "isi_notifikasi": "Sistem akan maintenance pada pukul 23:00 WIB",
    "tujuan": "ALL",
    "is_read": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "user_created": {
      "id": 1,
      "name": "Super Admin",
      "email": "superadmin@example.com"
    }
  }
}
```

---

### 8. POST /api/notifikasi/[id]/delete - Menghapus Notifikasi (Fallback)

**Endpoint:** `POST /api/notifikasi/[id]/delete`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data notifikasi berhasil dihapus"
}
```

---

## 📊 DASHBOARD STATS INTEGRATION

### GET /api/dashboard/stats - Dashboard dengan Data Conversion

**Endpoint:** `GET /api/dashboard/stats`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "total_anak": 150,
      "anak_keluar_bulan_ini": 12,
      "anak_aktif": 138,
      "conversion_data": {
        "total_records": 12,
        "total_leads": 600,
        "total_anak_keluar": 180,
        "total_conversi": 150,
        "conversion_rate": 25.0,
        "data": [
          {
            "id": 1,
            "jumlah_anak_keluar": 15,
            "jumlah_leads": 50,
            "jumlah_conversi": 12,
            "bulan": "January 2024",
            "tahun": 2024,
            "created_by": 1,
            "updated_by": 2,
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-20T14:45:00Z",
            "user_created": {
              "id": 1,
              "name": "Admin User",
              "email": "admin@example.com"
            },
            "user_updated": {
              "id": 2,
              "name": "Manager User",
              "email": "manager@example.com"
            }
          }
        ]
      }
    }
  }
}
```

---

## 🎯 CONTOH IMPLEMENTASI LENGKAP

### 1. React Component untuk Tabel Conversion

```jsx
import React, { useState } from 'react';
import { useConversionData, useCreateConversion, useUpdateConversion, useDeleteConversion } from '../hooks/conversionHooks';

const ConversionTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { data, loading, error, refetch } = useConversionData(page, 10, search);
  const { createConversion, loading: createLoading } = useCreateConversion();
  const { updateConversion, loading: updateLoading } = useUpdateConversion();
  const { deleteConversion, loading: deleteLoading } = useDeleteConversion();

  const handleSubmit = async (formData) => {
    try {
      if (editingId) {
        await updateConversion(editingId, formData);
      } else {
        await createConversion(formData);
      }
      setShowForm(false);
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        await deleteConversion(id);
        refetch();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="conversion-table">
      <div className="table-header">
        <h2>Data Conversion</h2>
        <button onClick={() => setShowForm(true)}>Tambah Data</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Cari berdasarkan bulan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Bulan</th>
            <th>Jumlah Anak Keluar</th>
            <th>Jumlah Leads</th>
            <th>Jumlah Conversi</th>
            <th>Conversion Rate</th>
            <th>Dibuat Oleh</th>
            <th>Diupdate Oleh</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.conversions?.map((item) => (
            <tr key={item.id}>
              <td>{item.bulan} {item.tahun}</td>
              <td>{item.jumlah_anak_keluar}</td>
              <td>{item.jumlah_leads}</td>
              <td>{item.jumlah_conversi}</td>
              <td>
                {item.jumlah_leads > 0 
                  ? ((item.jumlah_conversi / item.jumlah_leads) * 100).toFixed(2) + '%'
                  : '0%'
                }
              </td>
              <td>{item.user_created?.name}</td>
              <td>{item.user_updated?.name || '-'}</td>
              <td>
                <button onClick={() => setEditingId(item.id)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {data?.pagination && (
        <div className="pagination">
          <button 
            disabled={!data.pagination.has_prev}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>Page {data.pagination.current_page} of {data.pagination.total_pages}</span>
          <button 
            disabled={!data.pagination.has_next}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ConversionForm
          editingId={editingId}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          loading={createLoading || updateLoading}
        />
      )}
    </div>
  );
};

export default ConversionTable;
```

### 2. React Hook untuk Conversion

```javascript
// hooks/conversionHooks.js
import { useState, useEffect } from 'react';

export const useConversionData = (page = 1, limit = 10, search = '', bulan = '', tahun = '') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(bulan && { bulan }),
        ...(tahun && { tahun })
      });

      const response = await fetch(`/api/conversion?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search, bulan, tahun]);

  return { data, loading, error, refetch: fetchData };
};

export const useCreateConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createConversion = async (conversionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/conversion', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(conversionData)
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.message);
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createConversion, loading, error };
};

export const useUpdateConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateConversion = async (id, conversionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/conversion/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(conversionData)
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.message);
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateConversion, loading, error };
};

export const useDeleteConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteConversion = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/conversion/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteConversion, loading, error };
};
```

---

## 📋 CHECKLIST IMPLEMENTASI FRONTEND

### Untuk Conversion API:
- [ ] Buat halaman untuk menampilkan tabel conversion
- [ ] Implementasi fitur pencarian dan filter
- [ ] Buat form untuk menambah data conversion
- [ ] Buat form untuk edit data conversion
- [ ] Implementasi fitur delete dengan konfirmasi
- [ ] Tambahkan pagination
- [ ] Integrasikan dengan dashboard stats

### Untuk Notifikasi API:
- [ ] Buat halaman admin untuk mengelola notifikasi (superadmin)
- [ ] Implementasi fitur kirim notifikasi
- [ ] Buat komponen untuk menampilkan notifikasi user
- [ ] Implementasi fitur mark as read
- [ ] Tambahkan real-time notification (optional)

### Untuk Dashboard:
- [ ] Update dashboard untuk menampilkan data conversion
- [ ] Tambahkan chart/graph untuk conversion rate
- [ ] Tampilkan tabel conversion di dashboard

---

## 🔧 TROUBLESHOOTING

### Error 401 - Unauthorized
- Pastikan token JWT valid dan tidak expired
- Periksa header Authorization

### Error 400 - Bad Request
- Periksa format data yang dikirim
- Pastikan semua field required terisi

### Error 500 - Internal Server Error
- Periksa koneksi database
- Periksa log server

---

## 📞 SUPPORT

Jika ada pertanyaan atau masalah dalam implementasi, silakan hubungi tim backend untuk bantuan lebih lanjut. 