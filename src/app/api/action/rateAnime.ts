"use server";

import { db } from "~/server/db";
import { auth } from "~/server/auth";

export async function rateAnime(animeId: string, value: number) {
  const session = await auth();

  if (!session?.user?.id) throw new Error("Unauthorized");
  await db.rating.upsert({
    where: {
      userId_animeId: {
        userId: session.user.id,
        animeId,
      },
    },
    update: {
      value,
    },
    create: {
      animeId,
      userId: session.user.id,
      value,
    },
  });
}

export async function deleteRating(animeId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
  
    await db.rating.deleteMany({
      where: {
        userId: session.user.id,
        animeId,
      },
    });
  }
  