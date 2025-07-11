import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createCorsResponse, createCorsOptionsResponse } from "@/app/lib/cors";

// Inisialisasi Gemini dengan SDK baru
const ai = new GoogleGenAI({});

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Ambil header Authorization dari request user
    const authHeader = req.headers.get("authorization");

    // Ambil base URL dari env, default ke http://localhost:3000
    const baseUrl = process.env.INTERNAL_API_BASE_URL || "http://localhost:3000";
    // Selalu fetch ke backend tanpa header tambahan (karena /api/gemini-data sudah public)
    const dataRes = await fetch(`${baseUrl}/api/gemini-data`);
    if (!dataRes.ok) {
      const text = await dataRes.text();
      return createCorsResponse({ error: "Gagal ambil data: " + text }, 500, req);
    }
    let allData;
    try {
      allData = await dataRes.json();
    } catch (err) {
      const text = await dataRes.text();
      return createCorsResponse({ error: "Respon bukan JSON: " + text }, 500, req);
    }

    // Format prompt untuk Gemini (lebih rapi dan profesional)
    const prompt = `
### SYSTEM INSTRUCTION
Anda adalah asisten cerdas yang membantu menjawab pertanyaan user berdasarkan data berikut. Jawaban harus akurat, jelas, dan profesional. Jika data tidak ditemukan, jawab dengan jujur dan sopan.

### USER QUESTION
${message}

### DATA (JSON)
${JSON.stringify(allData, null, 2)}

### JAWABAN
Tuliskan jawaban Anda di bawah ini dengan bahasa yang mudah dipahami user, gunakan bullet/daftar jika perlu, dan sertakan insight jika relevan.
`;

    // Panggil Gemini API dengan SDK baru
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    } catch (e) {
      let errMsg = "";
      if (e instanceof Error) {
        errMsg = e.message;
      } else {
        errMsg = String(e);
      }
      return createCorsResponse({ error: "Gagal generate content dari Gemini: " + errMsg }, 500, req);
    }

    return createCorsResponse({ reply: response.text }, 200, req);
  } catch (err: any) {
    // Log error ke terminal agar bisa didiagnosa di production
    console.error('[API /api/chatbot] ERROR:', err);
    return createCorsResponse({ error: err.message || "Internal Server Error" }, 500, req);
  }
} 