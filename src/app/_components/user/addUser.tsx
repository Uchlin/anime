"use client";
import { UserPlusIcon } from "@heroicons/react/16/solid";
import { createUser } from "~/app/api/action/user";
 export function AddUser() {

  return (
      <form action={createUser} className="form-control w-full max-w-sm p-4 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Добавить пользователя</h2>
        <div className="flex flex-col max-w-xs space-y-2">
          <label>Электронная почта</label>
          <input type="email" name="email" required className="input input-bordered"/>
          <label>Логин</label>
          <input type="text" name="name" required className="input input-bordered"/>
          <label>Роль</label>
          <select name="role" required className="select select-bordered">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Добавить
          </button>
        </div>
      </form>
  );
}

