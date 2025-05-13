import Image from "next/image";
import Link from "next/link";
import { db } from "~/server/db";
import { FilterPanel } from "./../_components/filter-panel";
import Pagination from "../ui/pagination";
// import AddAnimeForm from "./../_components/catalog/AddAnimeForm"
import AddAnimeToggle from "./../_components/catalog/AddAnimeToggle";
export default async function CatalogPage(props: {
  searchParams?: Promise<{
    size?: string;
    page?: string;
    genre?: string;
    year?: string;
  }>;
}) {
  const searchParams = await props.searchParams || {};
  const page = Number(searchParams.page) || 1;
  const size = 3; // можно увеличить

  // Создаем объект фильтра для Prisma
  const filters: any = {};
  if (searchParams.genre) {
    filters.genre = {
      has: searchParams.genre, // Assuming genre is a string array column
    };
  }
  if (searchParams.year) {
    filters.year = Number(searchParams.year);
  }

  const count = await db.anime.count({
    where: filters,
  });
  const anime = await db.anime.findMany({
    where: filters,
    skip: (page - 1) * size,
    take: size,
  });
  const pages = Math.ceil(count / size);

  // Далее рендер как у тебя был
  return (
    <main className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Каталог аниме</h1>
      <AddAnimeToggle />
      <FilterPanel />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {anime.map((anime) => (
          <Link
            key={anime.id}
            href={`/catalog/${anime.id}`}
            className="rounded-lg overflow-hidden shadow-lg bg-gray-100 hover:shadow-xl transition"
          >
            <Image
              src={anime.image ? `/images/${anime.image}` : "/images/no.jpg"}
              alt={anime.title}
              width={350}
              height={300}
              className="object-cover"
            />
            <h2 className="text-xl font-semibold mt-2 text-gray-800 pl-2">
              {anime.title}
            </h2>
            <p className="text-sm text-gray-600 pl-2">{anime.year}</p>
          </Link>
        ))}
      </div>

      {pages > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination totalPages={pages} />
        </div>
      )}
    </main>
  );
}
