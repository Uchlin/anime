import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  try {
    const { animeId, text, parentId } = await req.json();
    console.log("Добавляем комментарий:", { animeId, text, parentId });
    const session = await auth();
    if (!session?.user?.id) {
      console.log("Неавторизованный пользователь");
      throw new Error("Unauthorized");
    }
    console.log("ghbdt",{ animeId, text, parentId, userId: session.user.id });
    const newComment = await db.comment.create({
      data: {
        animeId,
        text,
        userId: session.user.id,
        parentId: parentId ?? null,
      },
      include: { user: true },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Ошибка добавления комментария:", error);
    return NextResponse.json(
      { message: "Ошибка добавления комментария" },
      { status: 500 }
    );
  }
}
