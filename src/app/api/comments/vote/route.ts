import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
    try {
      const { commentId, value } = await req.json(); // value = 1 или -1
      if (![1, -1].includes(value)) {
        return NextResponse.json({ message: "Недопустимое значение голоса" }, { status: 400 });
      }
  
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ message: "Неавторизованный" }, { status: 401 });
      }
  
      const existingVote = await db.commentVote.findUnique({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId,
          },
        },
      });
  
      if (existingVote) {
        if (existingVote.value === value) {
          await db.commentVote.delete({ where: { id: existingVote.id } });
        } else {
          await db.commentVote.update({ where: { id: existingVote.id }, data: { value } });
        }
      } else {
        await db.commentVote.create({
          data: { userId: session.user.id, commentId, value },
        });
      }
  
      // Возвращаем статус без тела
      return NextResponse.json({}, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
  }
  
