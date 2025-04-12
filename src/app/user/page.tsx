import Image from "next/image";
import { db } from "~/server/db";

export default async function Page() {
  const users = await db.user.findMany();

  return (
    <main className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Пользователи</h1>

      <div className="grid gap-4 ">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-gray-100"
          >
            <Image
              src={user.image ? `/ava/${user.image}` : '/ava/no.jpg'}
              alt={user.name ?? "User Avatar"}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{user.name ?? "Без имени"}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}