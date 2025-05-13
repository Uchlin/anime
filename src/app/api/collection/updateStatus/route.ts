import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { NextResponse } from "next/server";

// POST метод для обновления или добавления статуса
export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const { animeId, status } = await req.json(); // Парсим данные из тела запроса

  if (!animeId || !status || !["PLAN_TO_WATCH", "WATCHING", "WATCHED"].includes(status)) {
    return NextResponse.json({ message: "Неверные данные" }, { status: 400 });
  }

  try {
    await db.animeCollection.upsert({
      where: { userId_animeId: { userId: session.user.id, animeId } },
      create: { userId: session.user.id, animeId, status },
      update: { status },
    });
    return NextResponse.json({ message: "Статус обновлен" }, { status: 200 });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ message: "Ошибка обновления" }, { status: 500 });
  }
}

// DELETE метод для удаления статуса
export async function DELETE(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const { animeId } = await req.json(); // Парсим данные из тела запроса

  if (!animeId) {
    return NextResponse.json({ message: "animeId не передан" }, { status: 400 });
  }

  try {
    const result = await db.animeCollection.delete({
      where: {
        userId_animeId: {
          userId: session.user.id,
          animeId,
        },
      },
    });

    if (result) {
      return NextResponse.json({ message: "Статус удален" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Запись не найдена" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting status:", error);
    return NextResponse.json({ message: "Ошибка при удалении статуса" }, { status: 500 });
  }
}
