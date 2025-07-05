# API Download File Lampiran

## Endpoint Download File

### GET `/api/lampiran/{filename}`

Endpoint sederhana untuk download file lampiran dari folder `public/uploads/lampiran/`.

#### Parameter
- `filename` (string): Nama file yang akan diunduh

#### Response
- **Success (200)**: File akan langsung diunduh
- **Error (400)**: Nama file tidak valid
- **Error (404)**: File tidak ditemukan
- **Error (500)**: Kesalahan server

#### Headers Response
```
Content-Type: <mime_type>
Content-Disposition: attachment; filename="original_filename"
Content-Length: <file_size>
```

#### Contoh Penggunaan

**Frontend (JavaScript/React):**
```javascript
// Download file dengan link langsung
const downloadFile = (filename) => {
  window.open(`/api/lampiran/${filename}`, '_blank');
};

// Atau dengan fetch
const downloadFile = async (filename) => {
  const response = await fetch(`/api/lampiran/${filename}`);
  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/^\d+-/, ''); // Remove timestamp
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
```

**HTML:**
```html
<a href="/api/lampiran/1750826996400-document.pdf" download>
  Download Document
</a>
```

#### Contoh URL
```
GET /api/lampiran/1750826996400-Hasil_EEG.pdf
GET /api/lampiran/1751639954552-Hasil_BERA.png
GET /api/lampiran/1750826996400-Laporan_Medis.docx
```

#### Fitur
- ✅ Validasi filename (mencegah directory traversal)
- ✅ MIME type detection otomatis
- ✅ Original filename (tanpa timestamp)
- ✅ Error handling
- ✅ File size validation

#### Struktur File
File disimpan di: `public/uploads/lampiran/{timestamp}-{original_filename}`

Contoh:
- `1750826996400-Hasil_EEG.pdf`
- `1751639954552-Hasil_BERA.png`
- `1750826996400-Laporan_Medis.docx`

#### Tipe File yang Didukung
- PDF: `application/pdf`
- Images: `image/png`, `image/jpeg`, `image/gif`
- Documents: `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Spreadsheets: `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Text: `text/plain`
- Dan lainnya sesuai MIME type detection 