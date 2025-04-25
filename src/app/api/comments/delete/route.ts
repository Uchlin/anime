import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  try {
    const { commentId } = await req.json();

    await db.comment.delete({ where: { id: commentId } });

    return NextResponse.json({ message: "Комментарий удален" });
  } catch (error) {
    return NextResponse.json({ message: "Ошибка удаления" }, { status: 500 });
  }
}
