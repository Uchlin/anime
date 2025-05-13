import Image from "next/image";
import Link from "next/link";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

export default async function WatchedPage() {
  const session = await auth();

  // Проверяем, авторизован ли пользователь
  if (!session?.user?.id) {
    return (
      <main className="p-6 max-w-screen-xl mx-auto">
        <h1 className="text-2xl text-red-500">Вы не авторизованы.</h1>
      </main>
    );
  }

  // Получаем список просмотренных аниме только для текущего пользователя
  const watchedList = await db.animeCollection.findMany({
    where: {
      userId: session.user.id,  // Добавляем фильтрацию по userId
      status: "WATCHED",  // Фильтруем по статусу "WATCHED"
    },
    include: {
      anime: true,
      user: true,
    },
  });

  return (
    <main className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Просмотренные</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {watchedList.map((entry) => (
          <Link
            key={entry.id}
            href={`/catalog/${entry.anime.id}`}
            className="rounded-lg overflow-hidden shadow-lg bg-gray-100 hover:shadow-xl transition block"
          >
            <Image
              src={entry.anime.image ? `/images/${entry.anime.image}` : "/images/no.jpg"}
              alt={entry.anime.title}
              width={350}
              height={300}
              className="rounded-xl mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold mt-2 text-gray-800 pl-2">{entry.anime.title}</h2>
            <p className="text-sm text-gray-600 mt-1 pl-2">Пользователь: {entry.user.name}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
