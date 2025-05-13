import { z } from "zod";
import { db } from "~/server/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const fd = z
    .object({
      id: z.string(),
    })
    .parse({
      id: formData.get("id"),
    });

  try {
    // Удаление пользователя из базы данных
    await db.user.delete({ where: { id: fd.id } });

    // Возвращаем успешный ответ на клиент
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
