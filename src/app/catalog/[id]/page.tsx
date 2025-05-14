
import { db } from "~/server/db";
import Image from "next/image";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ExpandableText } from "../../_components/catalog/ExpandableText";
import { Status } from "../../_components/catalog/Status";
import { RatingForm } from "~/app/ui/ratingForm";
import { auth } from "~/server/auth";
import { CommentForm } from "~/app/ui/commentForm";
import { CommentItem } from "../../_components/catalog/CommentItem";
import CommentList from "../../_components/catalog/CommentList";
import AnimeCommentsClient from "../../_components/catalog/AnimeCommentsClient";
import DeleteAnimeButton from "~/app/ui/DeleteAnimeButton";
import { AnimeEditForm } from "../../_components/catalog/AnimeDetailPage";
import AnimeEditToggle from "~/app/_components/catalog/AnimeEditToggle";
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
          votes: true,
        },
        orderBy: { createdAt: "desc" },
      },
      ratings: true,
    },
  });

  const session = await auth();
  const currentUser = session?.user ? {
    id: session.user.id,
    isAdmin: session.user.role === "ADMIN",
    } : null;
      if (!anime) {
        return <div>Аниме не найдено</div>;
      }
  if (!currentUser) return <div>Войдите, чтобы увидеть комментарии</div>;
  const ratings = anime.ratings;
  const userRating = ratings.find((r) => r.userId === session?.user?.id);
  const initialRating = userRating?.value;
  const userId = session?.user?.id;
  let userCollectionEntry = null;

  if (userId) {
    userCollectionEntry = await db.animeCollection.findUnique({
      where: {
        userId_animeId: {
          userId,
          animeId: anime.id,
        },
      },
    });
  }

  const commentsWithVotes = anime.comments.map((comment) => {
    const voteCount = comment.votes.reduce((sum, vote) => sum + vote.value, 0);
    const userVote = comment.votes.find(v => v.userId === userId)?.value ?? 0;

    return {
      ...comment,
      voteCount,
      userVote, // добавляем!
    };
  });
  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(1)
      : "0";

  const ratingCounts = [1, 2, 3, 4, 5].reduce((acc, value) => {
    acc[value] = ratings.filter((r) => r.value === value).length;
    return acc;
  }, {} as Record<number, number>);
  
  const role = (await auth())?.user.role;
  return (
    <main className="p-6 max-w-screen-xl mx-auto">
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
            <ul className="text-base">
              {[5, 4, 3, 2, 1].map((star) => (
                <li key={star}>
                  {"⭐".repeat(star)}: {ratingCounts[star] ?? 0}
                </li>
              ))}
            </ul>
          </div>
          <RatingForm animeId={anime.id} initialRating={initialRating} />
          {userId && (
          <Status animeId={anime.id} currentStatus={userCollectionEntry?.status || ""} />
        )}
        </div>
      </div>
      {role === "ADMIN" && <AnimeEditToggle anime={anime} />}
      {role === "ADMIN" && <DeleteAnimeButton animeId={anime.id} />}
      <ExpandableText text={anime.description ?? ""} />
      <AnimeCommentsClient
        animeId={anime.id}
        initialComments={commentsWithVotes}
        currentUser={currentUser}
      />
    </main>
  );
}