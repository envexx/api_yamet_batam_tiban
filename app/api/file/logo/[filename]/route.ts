import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(req: NextRequest) {
  // Ambil filename dari URL
  const filename = req.nextUrl.pathname.split("/").pop();
  if (!filename) {
    return NextResponse.json({ error: "Filename required" }, { status: 400 });
  }

  // Path ke file logo
  const filePath = path.join(process.cwd(), "public", "uploads", "logo", filename);

  try {
    const file = await fs.readFile(filePath);
    // Tentukan content-type dari ekstensi file
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(file, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (e) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
} 