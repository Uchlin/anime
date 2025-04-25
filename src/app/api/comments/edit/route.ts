import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  try {
    const { commentId, newText } = await req.json();

    await db.comment.update({
      where: { id: commentId },
      data: { text: newText },
    });

    return NextResponse.json({ message: "Комментарий обновлен" });
  } catch (error) {
    return NextResponse.json({ message: "Ошибка обновления" }, { status: 500 });
  }
}
