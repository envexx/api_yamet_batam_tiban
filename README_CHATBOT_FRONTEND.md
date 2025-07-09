# Dokumentasi Integrasi Chatbot Gemini di Frontend

Dokumentasi ini menjelaskan cara frontend (misal: React/Next.js) dapat berkomunikasi dengan backend chatbot Gemini yang sudah Anda siapkan.

---

## 1. **Alur Komunikasi**

1. **User** mengetik pertanyaan di frontend (chatbox).
2. **Frontend** mengirim request POST ke endpoint backend `/api/chatbot` dengan body JSON `{ message: "..." }`.
3. **Backend** menerima pertanyaan, mengambil data dari `/api/gemini-data`, lalu mengirim prompt ke Gemini API.
4. **Backend** mengembalikan jawaban Gemini ke frontend.
5. **Frontend** menampilkan jawaban ke user di chatbox.

---

## 2. **Format Request dari Frontend**

- **Endpoint:** `/api/chatbot`
- **Method:** `POST`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>` (WAJIB, didapat dari proses login)
- **Body:**
  ```json
  {
    "message": "Tulis pertanyaan user di sini"
  }
  ```

---

## 3. **Format Response dari Backend**

- **Sukses:**
  ```json
  {
    "reply": "Jawaban dari Gemini berdasarkan data dan pertanyaan user."
  }
  ```
- **Error:**
  ```json
  {
    "error": "Pesan error"
  }
  ```

---

## 4. **Contoh Kode Frontend (React/Next.js)**

```javascript
async function sendMessageToChatbot(message, jwtToken) {
  const res = await fetch('/api/chatbot', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}` // <-- WAJIB
    },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  return data.reply;
}

// Contoh pemakaian:
const jwtToken = "<JWT_TOKEN_DARI_LOGIN>";
const reply = await sendMessageToChatbot("Siapa saja anak yang terdaftar?", jwtToken);
console.log(reply);
```

---

## 5. **Ekspektasi Hasil**
- User dapat bertanya apapun terkait data yang ada di database (misal: daftar anak, program terapi, dsb).
- Chatbot akan menjawab berdasarkan data terbaru yang diambil dari backend.
- Jawaban yang diberikan adalah hasil dari model Gemini, sehingga bisa berupa penjelasan, daftar, atau instruksi sesuai konteks pertanyaan.

---

## 6. **Catatan Penting**
- **Wajib mengirim header Authorization: Bearer <JWT_TOKEN>** pada setiap request ke `/api/chatbot`.
- **Tidak perlu mengirim API key dari frontend.** Semua keamanan sudah diatur di backend.
- **Endpoint `/api/chatbot`** adalah satu-satunya pintu komunikasi frontend ke chatbot.
- Jika ada error, tampilkan pesan error yang ramah ke user.

---

## 7. **Contoh Tampilan Chatbox Sederhana (React)**

```jsx
import React, { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    setLoading(true);
    setMessages([...messages, { from: 'user', text: input }]);
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages(msgs => [...msgs, { from: 'bot', text: data.reply }]);
    setInput("");
    setLoading(false);
  };

  return (
    <div>
      <div style={{ minHeight: 200, border: '1px solid #ccc', padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left' }}>
            <b>{msg.from === 'user' ? 'Anda' : 'Bot'}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        disabled={loading}
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage} disabled={loading || !input}>Kirim</button>
    </div>
  );
}
```

---

## 8. **Troubleshooting**
- Jika tidak ada balasan, cek koneksi ke backend dan log error backend.
- Pastikan variabel environment sudah benar di backend.
- Jika jawaban tidak relevan, perbaiki prompt di backend.

---

Jika ada kebutuhan khusus (misal: format balasan, fitur chat lebih lanjut, dsb), silakan hubungi tim backend. 