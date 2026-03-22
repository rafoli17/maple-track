import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { documents, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

const documentUpdateSchema = z.object({
  status: z
    .enum([
      "NOT_STARTED",
      "GATHERING",
      "SUBMITTED",
      "APPROVED",
      "EXPIRED",
      "NEEDS_UPDATE",
    ])
    .optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
  fileUrl: z.string().optional(),
  name: z.string().optional(),
});

type RouteContext = { params: Promise<{ documentId: string }> };

export async function PUT(
  request: Request,
  ctx: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await ctx.params;

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const doc = await db.query.documents.findFirst({
      where: eq(documents.id, documentId),
    });

    if (!doc || doc.profileId !== profile.id) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = documentUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (data.status !== undefined) updateData.status = data.status;
    if (data.issueDate !== undefined)
      updateData.issueDate = new Date(data.issueDate);
    if (data.expiryDate !== undefined)
      updateData.expiryDate = new Date(data.expiryDate);
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;
    if (data.name !== undefined) updateData.name = data.name;

    const [updated] = await db
      .update(documents)
      .set(updateData)
      .where(eq(documents.id, documentId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[DOCUMENT_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await ctx.params;

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const doc = await db.query.documents.findFirst({
      where: eq(documents.id, documentId),
    });

    if (!doc || doc.profileId !== profile.id) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    await db.delete(documents).where(eq(documents.id, documentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DOCUMENT_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
