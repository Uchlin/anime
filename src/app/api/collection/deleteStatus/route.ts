import { db } from "~/server/db";
import { auth } from "~/server/auth";

export async function POST(req: Request) {
  const { animeId, status } = await req.json();  // Извлекаем данные из тела запроса
  
  if (!animeId || !status) {
    return new Response("Неверные данные", { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Не авторизован", { status: 401 });
  }

  try {
    await db.animeCollection.upsert({
      where: { userId_animeId: { userId: session.user.id, animeId } },
      create: { userId: session.user.id, animeId, status },
      update: { status },
    });

    return new Response("Статус обновлен", { status: 200 });
  } catch (error) {
    console.error("Error updating status:", error);
    return new Response("Ошибка обновления", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { animeId } = await req.json();  // Извлекаем данные из тела запроса
  
  if (!animeId) {
    return new Response("animeId не передан", { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Не авторизован", { status: 401 });
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
      return new Response("Статус удален", { status: 200 });
    }

    return new Response("Запись не найдена", { status: 404 });
  } catch (error) {
    console.error("Error deleting status:", error);
    return new Response("Ошибка при удалении статуса", { status: 500 });
  }
}
