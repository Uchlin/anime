import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(_: Request, { params }: { params: { animeId: string } }) {
    try {
      const comments = await db.comment.findMany({
        where: { animeId: params.animeId },
        include: {
          user: true,
          votes: true, // подтягиваем все голоса
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      // добавляем поле voteCount вручную
      const commentsWithVotes = comments.map((comment) => ({
        ...comment,
        voteCount: comment.votes.reduce((sum, vote) => sum + vote.value, 0),
      }));
  
      return NextResponse.json(commentsWithVotes);
    } catch (error) {
      console.error("Ошибка при получении комментариев:", error);
      return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
  }