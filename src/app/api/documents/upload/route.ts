import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo nao permitido. Use PDF, JPG, PNG ou WebP." },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Maximo 10MB." },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const pathname = `documents/${session.user.id}/${timestamp}-${safeName}`;

    const blob = await put(pathname, file, {
      access: "public",
    });

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      contentType: file.type,
    });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo" },
      { status: 500 }
    );
  }
}
