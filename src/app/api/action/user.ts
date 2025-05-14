"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/server/db";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function createUser(formData: FormData) {
  const fd = z
    .object({
      email: z.string().email(),
      name: z.string(),
      role: z.enum(["USER", "ADMIN"]),
    })
    .parse({
      email: formData.get("email"),
      name: formData.get("name"),
      role: formData.get("role"),
    });
  await db.user.create({
    data: {
      email: fd.email,
      name: fd.name,
      role: fd.role,
    },
  });
  revalidatePath("/user");
}

export async function deleteUser(formData: FormData) {
  const fd = z
    .object({
      id: z.string(),
    })
    .parse({
      id: formData.get("id"),
    });
  await db.user.delete({ where: { id: fd.id } });
  redirect("/user");
}

export async function updateUser(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const file = formData.get("image") as File | null;
  const role = formData.get("role") as "USER" | "ADMIN";

  // Проверяем и валидируем базовые поля
  const fd = z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      role: z.enum(["USER", "ADMIN"]),
    })
    .parse({ id, name, email, role });

  let imageFilename: string | undefined;

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop();
    imageFilename = `${uuidv4()}.${ext}`;
    const path = join(process.cwd(), "public/ava", imageFilename);
    await writeFile(path, buffer);
  }

  await db.user.update({
    where: { id: fd.id },
    data: {
      name: fd.name,
      email: fd.email,
      role: fd.role,
      ...(imageFilename && { image: imageFilename }),
    },
  });

  revalidatePath("/user/" + fd.id);
}
