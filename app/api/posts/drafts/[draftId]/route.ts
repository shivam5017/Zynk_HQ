import { NextResponse } from "next/server";
import { authSession } from "@/lib/server/auth-utils";
import db from "@/lib/db";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ draftId: string }> }
) {
  try {
    const session = await authSession();
    if (!session) {
      return NextResponse.json({ error: "not_logged_in" }, { status: 401 });
    }

    // ✅ MUST await params
    const { draftId } = await context.params;

    if (!draftId) {
      return NextResponse.json(
        { error: "draft_id_missing" },
        { status: 400 }
      );
    }

    // ✅ Ownership check
    const draft = await db.scheduledPost.findFirst({
      where: {
        id: draftId,
        userId: session.user.id,
        status: "DRAFT",
      },
    });

    if (!draft) {
      return NextResponse.json(
        { error: "draft_not_found" },
        { status: 404 }
      );
    }

    // ✅ Delete
    await db.scheduledPost.delete({
      where: { id: draftId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE draft error:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}
