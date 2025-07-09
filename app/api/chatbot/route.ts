import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Ambil header Authorization dari request user
    const authHeader = req.headers.get("authorization");

    // Selalu fetch ke backend (port 3000) dengan header Authorization
    const dataRes = await fetch("https://admin.yametbatamtiban.id/api/gemini-data", {
      headers: { 
        "x-gemini-api-key": process.env.GEMINI_DATA_API_KEY!,
        "authorization": authHeader || ""
      }
    });
    if (!dataRes.ok) {
      const text = await dataRes.text();
      return NextResponse.json({ error: "Gagal ambil data: " + text }, { status: 500 });
    }
    let allData;
    try {
      allData = await dataRes.json();
    } catch (err) {
      const text = await dataRes.text();
      return NextResponse.json({ error: "Respon bukan JSON: " + text }, { status: 500 });
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

    // Pastikan model yang dipakai benar-benar tersedia
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    } catch (e) {
      return NextResponse.json({ error: "Model gemini-pro tidak tersedia di project Anda. Cek Google Cloud Console dan endpoint." }, { status: 500 });
    }
    let result, response, text;
    try {
      result = await model.generateContent(prompt);
      response = await result.response;
      text = response.text();
    } catch (e) {
      let errMsg = "";
      if (e instanceof Error) {
        errMsg = e.message;
      } else {
        errMsg = String(e);
      }
      return NextResponse.json({ error: "Gagal generate content dari Gemini: " + errMsg }, { status: 500 });
    }

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    // Log error ke terminal agar bisa didiagnosa di production
    console.error('[API /api/chatbot] ERROR:', err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
} 