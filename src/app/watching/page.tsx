import Image from "next/image";
import { db } from "~/server/db";

export default async function WatchingPage() {
  const watchingList = await db.animeCollection.findMany({
    where: {
      status: "WATCHING",
    },
    include: {
      anime: true,
      user: true,
    },
  });

  return (
    <main className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Смотрю сейчас</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {watchingList.map((entry) => (
          <div
            key={entry.id}
            className="rounded-lg overflow-hidden shadow-lg bg-gray-100"
          >
            <Image
              src={entry.anime.image ?`/images/${entry.anime.image}` : "/images/no.jpg"}
              alt={entry.anime.title}
              width={300}
              height={450}
              className="object-cover"
            />
            <h2 className="text-xl font-semibold mt-2 text-gray-800 pl-2">{entry.anime.title}</h2>
            <p className="text-sm text-gray-600 pl-2">Прогресс: {entry.progress} серий</p>
            <p className="text-sm text-gray-600 mt-1 pl-2">Пользователь: {entry.user.name}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}