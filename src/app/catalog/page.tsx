import Image from 'next/image';
import { AnimeCard } from "./../_components/anime-card";
import { FilterPanel } from "./../_components/filter-panel";
import { db } from "~/server/db";

export default async function CatalogPage() {
  try {
    const animeList = await db.anime.findMany({
      orderBy: { year: "desc" },
    });

    return (
      <main className="p-6 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Каталог аниме</h1>

        <FilterPanel />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {animeList.map((anime) => (
            <div key={anime.id} className="rounded-lg overflow-hidden shadow-lg bg-gray-100">
              <Image
                src={anime.image ? `/images/${anime.image}` : '/images/no.jpg'}
                alt={anime.title}
                width={300}
                height={450}
                className="object-cover"
              />
              <h2 className="text-xl font-semibold mt-2 text-gray-800 pl-2">{anime.title}</h2>
              <p className="text-sm text-gray-600 pl-2">{anime.year}</p>
            </div>
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching anime:", error);
    return <div>Ошибка при загрузке данных. Попробуйте позже.</div>;
  }
}