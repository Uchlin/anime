import { db } from "~/server/db";
import Image from "next/image";

interface PageProps {
  params: { id: string };
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const anime = await db.anime.findUnique({
    where: { id: params.id },
  });

  if (!anime) {
    return <div>Аниме не найдено</div>;
  }

  return (
    <main className="p-6 max-w-screen-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">{anime.title}</h1>
      <Image
        src={anime.image ? `/images/${anime.image}` : "/images/no.jpg"}
        alt={anime.title}
        width={500}
        height={750}
        className="rounded-lg mb-4"
      />
      <p className="text-lg text-gray-700 mb-2">Год выпуска: {anime.year}</p>
      <p className="text-gray-600">{anime.description}</p>
    </main>
  );
}
