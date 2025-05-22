import Image from "next/image";
import Link from "next/link";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { FilterPanel } from "../_components/filter-panel";

export default async function WatchingPage(
  props: {
    searchParams?: Promise<{
      size?: string;
      page?: string;
      genre?: string;
      year?: string;
      sort?: string;
    }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const searchParams = await props.searchParams || {};
  if (!session?.user?.id) {
    return (
      <main className="p-6 max-w-screen-xl mx-auto">
        <h1 className="text-2xl text-red-500">Вы не авторизованы.</h1>
      </main>
    );
  }
  const filters: any = {};
  if (searchParams.genre) {
    filters.genre = {
      has: searchParams.genre,
    };
  }
  if (searchParams.year) {
    filters.year = Number(searchParams.year);
  }
  let orderBy: any = { year: "desc" };
  switch (searchParams.sort) {
    case "title_asc":
      orderBy = { title: "asc" };
      break;
    case "title_desc":
      orderBy = { title: "desc" };
      break;
    case "year_asc":
      orderBy = { year: "asc" };
      break;
    case "year_desc":
      orderBy = { year: "desc" };
      break;
  }
  const watchingList = await db.animeCollection.findMany({
    where: {
      userId: session.user.id,
      status: "WATCHING",
      anime: filters,
    },
    orderBy: {
      anime: orderBy,
    },
    include: {
      anime: true,
      user: true,
    },
  });

  return (
    <main className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Смотрю сейчас</h1>
      <FilterPanel basePath="/watching" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {watchingList.map((entry) => (
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
              className="object-cover"
            />
            <h2 className="text-xl font-semibold mt-2 text-gray-800 pl-2">{entry.anime.title}</h2>
            <p className="text-sm text-gray-600 mt-1 pl-2">Пользователь: {entry.user.name}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
