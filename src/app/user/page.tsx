import Image from "next/image";
import { db } from "~/server/db";
import { AddUser } from "../_components/user/addUser";
import Pagination from "../ui/pagination";
import { deleteUser, updateUser } from "~/app/api/action/user";
import { UserEditButton } from "../_components/user/UserEditButton";
import { DeleteAccountForm } from "../_components/user/DeleteAccountForm";

export default async function Page(props: {
  searchParams?: Promise<{
    size?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const size = 2;
  const count = await db.user.count();
  const users = await db.user.findMany({
    skip: (page - 1) * size,
    take: size,
  });
  const pages = Math.ceil(Number(count) / size);

  return (
    <main className="p-6 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold mb-6">Пользователи</h1>
          {users.map((user) => (
            <div
            key={user.id}
            className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 border rounded-lg shadow-sm bg-gray-100"
          >
            <div className="flex items-center gap-4">
              <Image
                src={user.image ? `/ava/${user.image}` : "/ava/no.jpg"}
                alt={user.name ?? "User Avatar"}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center gap-2">
                <p className="font-semibold text-gray-800">{user.name ?? "Без имени"}</p>
                <UserEditButton user={user} />
              </div>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">Роль: {user.role}</p>
            </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div id={`edit-form-${user.id}`} className="hidden">
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
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="select select-sm select-bordered max-w-[270px]"
                        required
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="input input-sm input-bordered max-w-[270px]"
                      />
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
          ))}
        </div>
        <div>
          <AddUser />
        </div>
      </div>
      {pages > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination totalPages={pages} />
        </div>
      )}
    </main>
  );
}
