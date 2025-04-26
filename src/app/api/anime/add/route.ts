// app/api/anime/add/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

export async function POST(req: NextRequest) {

  const body = await req.json();
  const { title, year, genre, description, image } = body;

  if (!title || !year || !genre) {
    return NextResponse.json({ message: "Обязательные поля отсутствуют" }, { status: 400 });
  }

  const newAnime = await db.anime.create({
    data: {
      title,
      year,
      genre,
      description,
      image,
    },
  });

  return NextResponse.json(newAnime);
}
