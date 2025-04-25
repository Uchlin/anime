
import { db } from "~/server/db";
import Image from "next/image";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ExpandableText } from "../../_components/catalog/ExpandableText";
import { RatingForm } from "~/app/ui/ratingForm";
import { auth } from "~/server/auth";
import { CommentForm } from "~/app/ui/commentForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const anime = await db.anime.findUnique({
    where: { id },
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

  const session = await auth();

  if (!anime) {
    return <div>Аниме не найдено</div>;
  }

  const ratings = anime.ratings;
  const userRating = ratings.find((r) => r.userId === session?.user?.id);
  const initialRating = userRating?.value;

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(1)
      : "0";

  const ratingCounts = [1, 2, 3, 4, 5].reduce((acc, value) => {
    acc[value] = ratings.filter((r) => r.value === value).length;
    return acc;
  }, {} as Record<number, number>);

  return (
    <main className="p-6 max-w-screen-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">{anime.title}</h1>
      <div className="flex gap-8 max-w-full">
        <div className="flex-shrink-0">
          <Image
            src={anime.image ? `/images/${anime.image}` : "/images/no.jpg"}
            alt={anime.title}
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-start text-white-600">
          <p className="text-lg">Год выпуска: {anime.year}</p>
          <p className="text-lg">Жанры: {anime.genre.join(", ")}</p>
          <p className="text-3xl font-semibold">Рейтинг</p>
          <div className="flex items-center gap-12">
            <div>
              <p className="text-5xl font-bold leading-none">{averageRating}</p>
              <p className="text-sm mt-1">
                {ratings.length === 0
                  ? "нет голосов"
                  : `${ratings.length} ${ratings.length === 1 ? "голос" : ratings.length < 5 ? "голоса" : "голосов"}`
                }
              </p>
            </div>
            <ul className="space-y-1 text-base">
              {[5, 4, 3, 2, 1].map((star) => (
                <li key={star}>
                  {"⭐".repeat(star)}: {ratingCounts[star] ?? 0}
                </li>
              ))}
            </ul>
          </div>
          <RatingForm animeId={anime.id} initialRating={initialRating} />
        </div>
      </div>
      <ExpandableText text={anime.description ?? ""} />

      {session?.user && <CommentForm animeId={anime.id} />}

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Комментарии</h2>
        {anime.comments.length > 0 ? (
          anime.comments.map((comment) => (
            <div key={comment.id} className="mb-4 border pb-4 flex items-start gap-4 rounded p-4 ">
              <Image
                src={comment.user.image ? `/ava/${comment.user.image}` : "/ava/no.jpg"}
                alt={comment.user.name ?? "User Avatar"}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-white-800">
                    {comment.user.name ?? "Аноним"}
                  </p>
                  <p className="text-sm text-white-500">
                    {format(new Date(comment.createdAt), "d MMMM yyyy", { locale: ru })}
                  </p>
                </div>
                <p className="text-white-800">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Комментариев пока нет.</p>
        )}
      </section>
    </main>
  );
}
