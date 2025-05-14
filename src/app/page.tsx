import Image from "next/image";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { SigninLink } from "./_components/signlink";
import { UserEditButton } from "./_components/user/UserEditButton";
import { DeleteAccountForm } from "./_components/user/DeleteAccountForm";
import { deleteUser, updateUser } from "~/app/api/action/user";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="p-6 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Добро пожаловать!</h1>
        <p className="mb-4">Пожалуйста, войдите в систему, чтобы продолжить.</p>
        <SigninLink />
      </main>
    );
  }

  const user = session.user;

  const [commentsCount, planCount, watchingCount, watchedCount, comments] = await Promise.all([
    db.comment.count({ where: { userId: user.id } }),
    db.animeCollection.count({ where: { userId: user.id, status: "PLAN_TO_WATCH" } }),
    db.animeCollection.count({ where: { userId: user.id, status: "WATCHING" } }),
    db.animeCollection.count({ where: { userId: user.id, status: "WATCHED" } }),
    db.comment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { anime: true }, // Включаем связанные аниме
    }) // Получаем комментарии с аниме
  ]);

  return (
    <main className="p-6 max-w-screen-xl mx-auto relative">
      <div className="flex justify-between items-start gap-6 w-full max-w-[850px]">
        {/* Левая часть */}
        <div className="flex items-center gap-4">
          <Image
            src={user.image ? `/ava/${user.image}` : "/ava/no.jpg"}
            alt={user.name ?? "User Avatar"}
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center gap-2">
              <p className="font-semibold text-2xl text-white-800">{user.name ?? "Без имени"}</p>
              <UserEditButton user={user} />
            </div>
            <p className="text-white-600">{user.email}</p>
          </div>
        </div>

        {/* Правая часть (форма) */}
        <div className="relative flex flex-col items-end gap-2 -mt-4">
          <div
            id={`edit-form-${user.id}`}
            className="absolute right-4 top-4 z-10 bg-white-600 p-4 rounded-md w-96 "
          >
            <div className="flex items-start gap-2">
              <form action={updateUser} className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2">
                    <input type="hidden" name="id" defaultValue={user.id} />
                    <input
                      type="text"
                      name="name"
                      defaultValue={user.name || "Без имени"}
                      className="input input-sm input-bordered max-w-[280px]"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      defaultValue={user.email || ""}
                      className="input input-sm input-bordered max-w-[280px]"
                    />
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="input input-sm input-bordered max-w-[270px]"
                    />
                    <input type="hidden" name="role" value={user.role} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <button type="submit" className="btn btn-sm btn-primary w-20 h-16">
                      Сохранить
                    </button>
                  </div>
                </div>
              </form>
              <DeleteAccountForm userId={user.id} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6 mb-6">
        <StatBox count={commentsCount} label="Комментариев" />
        <StatBox count={planCount} label="Планирую" href="/plan" />
        <StatBox count={watchingCount} label="Смотрю" href="/watching" />
        <StatBox count={watchedCount} label="Просмотрено" href="/watched" />
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Ваши комментарии</h2>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
                <Link href={`/catalog/${comment.animeId}`} className="text-xl font-semibold text-blue-600">
                  {comment.anime.title}
                </Link>
                <p className="text-white mt-2">{comment.text}</p>
                <p className="text-sm text-white mt-2">Дата: {new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>У вас нет комментариев.</p>
        )}
      </div>
    </main>
  );
}

function StatBox({ count, label, href }: { count: number; label: string; href?: string }) {
  const content = (
    <div className="bg-white-600 p-4 min-w-[150px] flex flex-col items-center">
      <span className="text-2xl font-bold">{count}</span>
      <span className="text-gray-600 text-sm mt-1">{label}</span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
