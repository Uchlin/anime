import { db } from "~/server/db";
import Image from "next/image";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ExpandableText } from "../../_components/catalog/ExpandableText";

interface PageProps {
  params: { id: string };
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const anime = await db.anime.findUnique({
    where: { id: params.id },
    include: {
      comments: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
      },
      ratings: true,
    },
  });

  if (!anime) {
    return <div>Аниме не найдено</div>;
  }

  const ratings = anime.ratings;
  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(1)
      : "Нет оценок";

  const ratingCounts = [1, 2, 3, 4, 5].reduce((acc, value) => {
    acc[value] = ratings.filter((r) => r.value === value).length;
    return acc;
  }, {} as Record<number, number>);

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
      <p className="text-lg text-gray-700 mb-2">Жанры: {anime.genre.join(", ")}</p>
      <p className="text-lg text-gray-700 mb-2">
        Средняя оценка: {averageRating}{" "}
        <span className="text-sm text-gray-500">
        ({ratings.length} {ratings.length === 1 ? "голос" : ratings.length < 5 ? "голоса" : "голосов"})
        </span>
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Распределение оценок:</h3>
        <ul className="text-gray-700 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <li key={star}>
              {"⭐".repeat(star)}: {ratingCounts[star] ?? 0}
            </li>
          ))}
        </ul>
      </div>

      <ExpandableText text={anime.description ?? ""} />
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Комментарии</h2>
        {anime.comments.length > 0 ? (
          anime.comments.map((comment) => (
            <div key={comment.id} className="mb-4 border-b pb-2">
              <p className="text-gray-800">
                <span className="font-semibold">{comment.user.name ?? "Аноним"}:</span>{" "}
                {comment.text}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(comment.createdAt), "d MMMM yyyy", { locale: ru })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Комментариев пока нет.</p>
        )}
      </section>
    </main>
  );
}
