import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(_: Request, { params }: { params: { animeId: string } }) {
  try {
    const comments = await db.comment.findMany({
      where: { animeId: params.animeId },
      include: {
        user: true,
        votes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Сначала группируем по parentId
    const commentsByParentId = comments.reduce((acc, comment) => {
      const key = comment.parentId ?? "root";
      if (!acc[key]) acc[key] = [];
      acc[key].push(comment);
      return acc;
    }, {} as Record<string, typeof comments>);

    type CommentWithReplies = typeof comments[0] & {
      voteCount: number;
      replies: CommentWithReplies[];
    };
    
    function buildTree(parentId: string | null = null): CommentWithReplies[] {
      return (commentsByParentId[parentId ?? "root"] || []).map(comment => ({
        ...comment,
        voteCount: comment.votes.reduce((sum, vote) => sum + vote.value, 0),
        replies: buildTree(comment.id),
      }));
    }

    const commentTree = buildTree();

    return NextResponse.json(commentTree);
  } catch (error) {
    console.error("Ошибка при получении комментариев:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
