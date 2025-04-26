// app/api/anime/delete/route.ts

import { db } from "~/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID не указан" }, { status: 400 });
    }

    await db.anime.delete({ where: { id } });

    return NextResponse.json({ message: "Удалено" });
  } catch (error) {
    return NextResponse.json({ message: "Ошибка при удалении" }, { status: 500 });
  }
}
