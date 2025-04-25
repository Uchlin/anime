"use server";

import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { revalidatePath } from "next/cache";

export async function addComment(animeId: string, text: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await db.comment.create({
    data: {
      text,
      animeId,
      userId: session.user.id,
    },
  });

  revalidatePath(`/catalog/${animeId}`);
}

export async function updateComment(commentId: string, text: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const comment = await db.comment.findUnique({
    where: { id: commentId },
  });

  if (comment?.userId !== session.user.id) return;

  await db.comment.update({
    where: { id: commentId },
    data: { text },
  });

  revalidatePath(`/catalog/${comment.animeId}`);
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const comment = await db.comment.findUnique({
    where: { id: commentId },
  });

  if (comment?.userId !== session.user.id) return;

  await db.comment.delete({
    where: { id: commentId },
  });

  revalidatePath(`/catalog/${comment.animeId}`);
}
