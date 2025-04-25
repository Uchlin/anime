import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  try {
    const { animeId, text } = await req.json();
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const newComment = await db.comment.create({
        data: {
          animeId,
          text,
          userId: session.user.id, // обязательно укажи пользователя
        },
        include: {
          user: true, // чтобы вернуть пользователя вместе с комментарием
        },
      });

    return NextResponse.json(newComment);
  } catch (error) {
    return NextResponse.json({ message: "Ошибка добавления комментария" }, { status: 500 });
  }
}
